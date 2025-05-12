// // // // // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // // // import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
// // // // // // // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // // // // // // //   const { formId } = useParams();
// // // // // // // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // // // // // // //   // Sample options for select fields, matching FormViewer.js fallback
// // // // // // // // // // // // //   const selectOptions = {
// // // // // // // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // //     const fetchForm = async () => {
// // // // // // // // // // // // //       try {
// // // // // // // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // // // // // // //         if (formSnap.exists()) {
// // // // // // // // // // // // //           setFormData(formSnap.data());
// // // // // // // // // // // // //           // Initialize form values with default values
// // // // // // // // // // // // //           const initialValues = {};
// // // // // // // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // // // // // // //           });
// // // // // // // // // // // // //           setFormValues(initialValues);
// // // // // // // // // // // // //         } else {
// // // // // // // // // // // // //           setSubmitError("Form not found");
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //       } catch (err) {
// // // // // // // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     };
// // // // // // // // // // // // //     fetchForm();
// // // // // // // // // // // // //   }, [formId]);

// // // // // // // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // // // // // // //     if (errors[fieldId]) {
// // // // // // // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const validateForm = () => {
// // // // // // // // // // // // //     const newErrors = {};
// // // // // // // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // // // // // // //         }
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     });
// // // // // // // // // // // // //     setErrors(newErrors);
// // // // // // // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // // // // // // //     e.preventDefault();
// // // // // // // // // // // // //     if (!validateForm()) {
// // // // // // // // // // // // //       return;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //     try {
// // // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // // //       setSubmitError(null);
// // // // // // // // // // // // //       const enquiryData = {
// // // // // // // // // // // // //         formId,
// // // // // // // // // // // // //         ...formValues,
// // // // // // // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // // // // // // //       };
// // // // // // // // // // // // //       await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // // // // // //       setSubmitted(true);
// // // // // // // // // // // // //       setFormValues({});
// // // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // // // // // //     } finally {
// // // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   if (submitError) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   if (!formData) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   if (submitted) {
// // // // // // // // // // // // //     return (
// // // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // // // // // // //           <Button
// // // // // // // // // // // // //             color="blue"
// // // // // // // // // // // // //             className="mt-4"
// // // // // // // // // // // // //             onClick={() => {
// // // // // // // // // // // // //               setSubmitted(false);
// // // // // // // // // // // // //               setFormValues(
// // // // // // // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // // // // // // //                   return acc;
// // // // // // // // // // // // //                 }, {})
// // // // // // // // // // // // //               );
// // // // // // // // // // // // //             }}
// // // // // // // // // // // // //           >
// // // // // // // // // // // // //             Submit Another
// // // // // // // // // // // // //           </Button>
// // // // // // // // // // // // //         </div>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   }

// // // // // // // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // // // // // // //           {formData.fields.map((field) => {
// // // // // // // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // // // //             if (!fieldDef) return null;

// // // // // // // // // // // // //             const isError = !!errors[field.id];

// // // // // // // // // // // // //             return (
// // // // // // // // // // // // //               <div key={field.id}>
// // // // // // // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // // // // // // //                   <div>
// // // // // // // // // // // // //                     <label
// // // // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // // // //                     </label>
// // // // // // // // // // // // //                     <textarea
// // // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // // // //                       rows={4}
// // // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // // //                     />
// // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // // // // // // //                     <Select
// // // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // // //                       label={fieldDef.label}
// // // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       <MenuItem value="">
// // // // // // // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // // // // // // //                       </MenuItem>
// // // // // // // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // // // // // // //                           {option}
// // // // // // // // // // // // //                         </MenuItem>
// // // // // // // // // // // // //                       ))}
// // // // // // // // // // // // //                     </Select>
// // // // // // // // // // // // //                   </FormControl>
// // // // // // // // // // // // //                 ) : (
// // // // // // // // // // // // //                   <div>
// // // // // // // // // // // // //                     <label
// // // // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // // // //                     >
// // // // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // // // //                     </label>
// // // // // // // // // // // // //                     <input
// // // // // // // // // // // // //                       type={fieldDef.type}
// // // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // // //                     />
// // // // // // // // // // // // //                   </div>
// // // // // // // // // // // // //                 )}
// // // // // // // // // // // // //                 {isError && (
// // // // // // // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // // // // // // //                 )}
// // // // // // // // // // // // //               </div>
// // // // // // // // // // // // //             );
// // // // // // // // // // // // //           })}
// // // // // // // // // // // // //           {submitError && (
// // // // // // // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // // // // // // //           )}
// // // // // // // // // // // // //           <div className="flex justify-end">
// // // // // // // // // // // // //             <Button
// // // // // // // // // // // // //               type="submit"
// // // // // // // // // // // // //               color="blue"
// // // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // // // // // // //             </Button>
// // // // // // // // // // // // //           </div>
// // // // // // // // // // // // //         </form>
// // // // // // // // // // // // //       </div>
// // // // // // // // // // // // //     </div>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default SubmitEnquiryForm;


// // // // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // // import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // // // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // // // // // //   const { formId } = useParams();
// // // // // // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // // // // // //   // Sample options for select fields, matching FormViewer.js fallback
// // // // // // // // // // // //   const selectOptions = {
// // // // // // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // // // // // //   };

// // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // //     const fetchForm = async () => {
// // // // // // // // // // // //       try {
// // // // // // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // // // // // //         if (formSnap.exists()) {
// // // // // // // // // // // //           setFormData(formSnap.data());
// // // // // // // // // // // //           // Initialize form values with default values
// // // // // // // // // // // //           const initialValues = {};
// // // // // // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // // // // // //           });
// // // // // // // // // // // //           setFormValues(initialValues);
// // // // // // // // // // // //         } else {
// // // // // // // // // // // //           setSubmitError("Form not found");
// // // // // // // // // // // //         }
// // // // // // // // // // // //       } catch (err) {
// // // // // // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // // // // // //       }
// // // // // // // // // // // //     };
// // // // // // // // // // // //     fetchForm();
// // // // // // // // // // // //   }, [formId]);

// // // // // // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // // // // // //     if (errors[fieldId]) {
// // // // // // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const validateForm = () => {
// // // // // // // // // // // //     const newErrors = {};
// // // // // // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // // // // // //       }
// // // // // // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // // // // // //         }
// // // // // // // // // // // //       }
// // // // // // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // // // // // //       }
// // // // // // // // // // // //     });
// // // // // // // // // // // //     setErrors(newErrors);
// // // // // // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // // // // // //     e.preventDefault();
// // // // // // // // // // // //     if (!validateForm()) {
// // // // // // // // // // // //       return;
// // // // // // // // // // // //     }
// // // // // // // // // // // //     try {
// // // // // // // // // // // //       setLoading(true);
// // // // // // // // // // // //       setSubmitError(null);

// // // // // // // // // // // //       // Prepare enquiry data
// // // // // // // // // // // //       const enquiryData = {
// // // // // // // // // // // //         formId,
// // // // // // // // // // // //         ...formValues,
// // // // // // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // // // // //       };

// // // // // // // // // // // //       // Check for existing enquiry by email
// // // // // // // // // // // //       const email = formValues.email?.trim();
// // // // // // // // // // // //       let existingEnquiry = null;

// // // // // // // // // // // //       if (email) {
// // // // // // // // // // // //         const enquiriesRef = collection(db, "enquiries");
// // // // // // // // // // // //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // // // // // // //         const emailSnapshot = await getDocs(emailQuery);
// // // // // // // // // // // //         if (!emailSnapshot.empty) {
// // // // // // // // // // // //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // // // // // // // // // // //         }
// // // // // // // // // // // //       }

// // // // // // // // // // // //       if (existingEnquiry) {
// // // // // // // // // // // //         // Overwrite existing enquiry, preserving only createdAt
// // // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // // // // // //         const updatedData = {
// // // // // // // // // // // //           ...enquiryData,
// // // // // // // // // // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(), // Preserve original createdAt
// // // // // // // // // // // //         };
// // // // // // // // // // // //         await updateDoc(enquiryRef, updatedData);
// // // // // // // // // // // //         console.log(`Overwrote existing enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // // // // // //       } else {
// // // // // // // // // // // //         // Create new enquiry
// // // // // // // // // // // //         await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // // // // //         console.log("Created new enquiry");
// // // // // // // // // // // //       }

// // // // // // // // // // // //       setSubmitted(true);
// // // // // // // // // // // //       setFormValues(
// // // // // // // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // // // // // // //           return acc;
// // // // // // // // // // // //         }, {})
// // // // // // // // // // // //       );
// // // // // // // // // // // //     } catch (err) {
// // // // // // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // // // // //     } finally {
// // // // // // // // // // // //       setLoading(false);
// // // // // // // // // // // //     }
// // // // // // // // // // // //   };


// // // // // // // // // // // //   // const handleSubmit = async (e) => {
// // // // // // // // // // // //   //   e.preventDefault();
// // // // // // // // // // // //   //   if (!validateForm()) {
// // // // // // // // // // // //   //     return;
// // // // // // // // // // // //   //   }
// // // // // // // // // // // //   //   try {
// // // // // // // // // // // //   //     setLoading(true);
// // // // // // // // // // // //   //     setSubmitError(null);

// // // // // // // // // // // //   //     // Prepare enquiry data
// // // // // // // // // // // //   //     const enquiryData = {
// // // // // // // // // // // //   //       formId,
// // // // // // // // // // // //   //       ...formValues,
// // // // // // // // // // // //   //       status: formValues.stage || "prequalified",
// // // // // // // // // // // //   //       createdAt: serverTimestamp(),
// // // // // // // // // // // //   //       updatedAt: serverTimestamp(),
// // // // // // // // // // // //   //     };

// // // // // // // // // // // //   //     // Check for existing enquiry by email or phone
// // // // // // // // // // // //   //     const email = formValues.email?.trim();
// // // // // // // // // // // //   //     const phone = formValues.phone?.trim();
// // // // // // // // // // // //   //     let existingEnquiry = null;

// // // // // // // // // // // //   //     if (email || phone) {
// // // // // // // // // // // //   //       const enquiriesRef = collection(db, "enquiries");
// // // // // // // // // // // //   //       const queries = [];
// // // // // // // // // // // //   //       if (email) {
// // // // // // // // // // // //   //         queries.push(query(enquiriesRef, where("email", "==", email)));
// // // // // // // // // // // //   //       }
// // // // // // // // // // // //   //       if (phone) {
// // // // // // // // // // // //   //         queries.push(query(enquiriesRef, where("phone", "==", phone)));
// // // // // // // // // // // //   //       }

// // // // // // // // // // // //   //       // Execute queries
// // // // // // // // // // // //   //       const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));
// // // // // // // // // // // //   //       for (const snapshot of querySnapshots) {
// // // // // // // // // // // //   //         if (!snapshot.empty) {
// // // // // // // // // // // //   //           existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
// // // // // // // // // // // //   //           break; // Take the first match
// // // // // // // // // // // //   //         }
// // // // // // // // // // // //   //       }
// // // // // // // // // // // //   //     }

// // // // // // // // // // // //   //     if (existingEnquiry) {
// // // // // // // // // // // //   //       // Update existing enquiry
// // // // // // // // // // // //   //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // // // // // //   //       const updatedData = {
// // // // // // // // // // // //   //         ...existingEnquiry, // Preserve existing fields
// // // // // // // // // // // //   //         ...enquiryData, // Overwrite with new form values
// // // // // // // // // // // //   //         updatedAt: serverTimestamp(),
// // // // // // // // // // // //   //         // Ensure createdAt is not overwritten
// // // // // // // // // // // //   //         createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // // // // // // //   //       };
// // // // // // // // // // // //   //       await updateDoc(enquiryRef, updatedData);
// // // // // // // // // // // //   //       console.log(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // // // // // //   //     } else {
// // // // // // // // // // // //   //       // Create new enquiry
// // // // // // // // // // // //   //       await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // // // // //   //       console.log("Created new enquiry");
// // // // // // // // // // // //   //     }

// // // // // // // // // // // //   //     setSubmitted(true);
// // // // // // // // // // // //   //     setFormValues(
// // // // // // // // // // // //   //       formData.fields.reduce((acc, field) => {
// // // // // // // // // // // //   //         acc[field.id] = field.defaultValue || "";
// // // // // // // // // // // //   //         return acc;
// // // // // // // // // // // //   //       }, {})
// // // // // // // // // // // //   //     );
// // // // // // // // // // // //   //   } catch (err) {
// // // // // // // // // // // //   //     setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // // // // //   //   } finally {
// // // // // // // // // // // //   //     setLoading(false);
// // // // // // // // // // // //   //   }
// // // // // // // // // // // //   // };

// // // // // // // // // // // //   if (submitError) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }

// // // // // // // // // // // //   if (!formData) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }

// // // // // // // // // // // //   if (submitted) {
// // // // // // // // // // // //     return (
// // // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // // // // // //           <Button
// // // // // // // // // // // //             color="blue"
// // // // // // // // // // // //             className="mt-4"
// // // // // // // // // // // //             onClick={() => {
// // // // // // // // // // // //               setSubmitted(false);
// // // // // // // // // // // //               setFormValues(
// // // // // // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // // // // // //                   return acc;
// // // // // // // // // // // //                 }, {})
// // // // // // // // // // // //               );
// // // // // // // // // // // //             }}
// // // // // // // // // // // //           >
// // // // // // // // // // // //             Submit Another
// // // // // // // // // // // //           </Button>
// // // // // // // // // // // //         </div>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     );
// // // // // // // // // // // //   }

// // // // // // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // // // // // //           {formData.fields.map((field) => {
// // // // // // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // // //             if (!fieldDef) return null;

// // // // // // // // // // // //             const isError = !!errors[field.id];

// // // // // // // // // // // //             return (
// // // // // // // // // // // //               <div key={field.id}>
// // // // // // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // // // // // //                   <div>
// // // // // // // // // // // //                     <label
// // // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // // //                     </label>
// // // // // // // // // // // //                     <textarea
// // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // // //                       rows={4}
// // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // // // // // //                     <Select
// // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // //                       label={fieldDef.label}
// // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       <MenuItem value="">
// // // // // // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // // // // // //                       </MenuItem>
// // // // // // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // // // // // //                           {option}
// // // // // // // // // // // //                         </MenuItem>
// // // // // // // // // // // //                       ))}
// // // // // // // // // // // //                     </Select>
// // // // // // // // // // // //                   </FormControl>
// // // // // // // // // // // //                 ) : (
// // // // // // // // // // // //                   <div>
// // // // // // // // // // // //                     <label
// // // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // // //                     >
// // // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // // //                     </label>
// // // // // // // // // // // //                     <input
// // // // // // // // // // // //                       type={fieldDef.type}
// // // // // // // // // // // //                       id={field.id}
// // // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // // //                     />
// // // // // // // // // // // //                   </div>
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //                 {isError && (
// // // // // // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // // // // // //                 )}
// // // // // // // // // // // //               </div>
// // // // // // // // // // // //             );
// // // // // // // // // // // //           })}
// // // // // // // // // // // //           {submitError && (
// // // // // // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // // // // // //           )}
// // // // // // // // // // // //           <div className="flex justify-end">
// // // // // // // // // // // //             <Button
// // // // // // // // // // // //               type="submit"
// // // // // // // // // // // //               color="blue"
// // // // // // // // // // // //               disabled={loading}
// // // // // // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // // // // // //             </Button>
// // // // // // // // // // // //           </div>
// // // // // // // // // // // //         </form>
// // // // // // // // // // // //       </div>
// // // // // // // // // // // //     </div>
// // // // // // // // // // // //   );
// // // // // // // // // // // // };

// // // // // // // // // // // // export default SubmitEnquiryForm;



// // // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // // // // //   const { formId } = useParams();
// // // // // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // // // // //   // Sample options for select fields
// // // // // // // // // // //   const selectOptions = {
// // // // // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // // // // //   };

// // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // //     const fetchForm = async () => {
// // // // // // // // // // //       try {
// // // // // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // // // // //         if (formSnap.exists()) {
// // // // // // // // // // //           setFormData(formSnap.data());
// // // // // // // // // // //           const initialValues = {};
// // // // // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // // // // //           });
// // // // // // // // // // //           setFormValues(initialValues);
// // // // // // // // // // //         } else {
// // // // // // // // // // //           setSubmitError("Form not found");
// // // // // // // // // // //         }
// // // // // // // // // // //       } catch (err) {
// // // // // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // // // // //       }
// // // // // // // // // // //     };
// // // // // // // // // // //     fetchForm();
// // // // // // // // // // //   }, [formId]);

// // // // // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // // // // //     if (errors[fieldId]) {
// // // // // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   const validateForm = () => {
// // // // // // // // // // //     const newErrors = {};
// // // // // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // // // // //       }
// // // // // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // // // // //         }
// // // // // // // // // // //       }
// // // // // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // // // // //       }
// // // // // // // // // // //     });
// // // // // // // // // // //     setErrors(newErrors);
// // // // // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // // // // //   };

// // // // // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // // // // //     e.preventDefault();
// // // // // // // // // // //     if (!validateForm()) {
// // // // // // // // // // //       return;
// // // // // // // // // // //     }
// // // // // // // // // // //     try {
// // // // // // // // // // //       setLoading(true);
// // // // // // // // // // //       setSubmitError(null);

// // // // // // // // // // //       // Prepare enquiry data
// // // // // // // // // // //       const enquiryData = {
// // // // // // // // // // //         formId,
// // // // // // // // // // //         ...formValues,
// // // // // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // // // //       };

// // // // // // // // // // //       // Check for existing enquiry by email
// // // // // // // // // // //       const email = formValues.email?.trim();
// // // // // // // // // // //       let existingEnquiry = null;

// // // // // // // // // // //       if (email) {
// // // // // // // // // // //         const enquiriesRef = collection(db, "enquiries");
// // // // // // // // // // //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // // // // // //         const emailSnapshot = await getDocs(emailQuery);
// // // // // // // // // // //         if (!emailSnapshot.empty) {
// // // // // // // // // // //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // // // // // // // // // //         }
// // // // // // // // // // //       }

// // // // // // // // // // //       if (existingEnquiry) {
// // // // // // // // // // //         // Completely overwrite existing enquiry, preserving only createdAt
// // // // // // // // // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // // // // //         const updatedData = {
// // // // // // // // // // //           ...enquiryData,
// // // // // // // // // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // // // // // //         };
// // // // // // // // // // //         await setDoc(enquiryRef, updatedData, { merge: false });
// // // // // // // // // // //         console.log(`Overwrote existing enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // // // // //       } else {
// // // // // // // // // // //         // Create new enquiry
// // // // // // // // // // //         await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // // // //         console.log("Created new enquiry");
// // // // // // // // // // //       }

// // // // // // // // // // //       setSubmitted(true);
// // // // // // // // // // //       setFormValues(
// // // // // // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // // // // // //           return acc;
// // // // // // // // // // //         }, {})
// // // // // // // // // // //       );
// // // // // // // // // // //     } catch (err) {
// // // // // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // // // //     } finally {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   if (submitError) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   if (!formData) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   if (submitted) {
// // // // // // // // // // //     return (
// // // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // // // // //           <Button
// // // // // // // // // // //             color="blue"
// // // // // // // // // // //             className="mt-4"
// // // // // // // // // // //             onClick={() => {
// // // // // // // // // // //               setSubmitted(false);
// // // // // // // // // // //               setFormValues(
// // // // // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // // // // //                   return acc;
// // // // // // // // // // //                 }, {})
// // // // // // // // // // //               );
// // // // // // // // // // //             }}
// // // // // // // // // // //           >
// // // // // // // // // // //             Submit Another
// // // // // // // // // // //           </Button>
// // // // // // // // // // //         </div>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     );
// // // // // // // // // // //   }

// // // // // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // // // // //           {formData.fields.map((field) => {
// // // // // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // // //             if (!fieldDef) return null;

// // // // // // // // // // //             const isError = !!errors[field.id];

// // // // // // // // // // //             return (
// // // // // // // // // // //               <div key={field.id}>
// // // // // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     <label
// // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // //                     >
// // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // //                     </label>
// // // // // // // // // // //                     <textarea
// // // // // // // // // // //                       id={field.id}
// // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // //                       rows={4}
// // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // //                     />
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // // // // //                     <Select
// // // // // // // // // // //                       id={field.id}
// // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // //                       label={fieldDef.label}
// // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // //                     >
// // // // // // // // // // //                       <MenuItem value="">
// // // // // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // // // // //                       </MenuItem>
// // // // // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // // // // //                           {option}
// // // // // // // // // // //                         </MenuItem>
// // // // // // // // // // //                       ))}
// // // // // // // // // // //                     </Select>
// // // // // // // // // // //                   </FormControl>
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <div>
// // // // // // // // // // //                     <label
// // // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // // //                     >
// // // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // // //                     </label>
// // // // // // // // // // //                     <input
// // // // // // // // // // //                       type={fieldDef.type}
// // // // // // // // // // //                       id={field.id}
// // // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // // //                       disabled={loading}
// // // // // // // // // // //                     />
// // // // // // // // // // //                   </div>
// // // // // // // // // // //                 )}
// // // // // // // // // // //                 {isError && (
// // // // // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </div>
// // // // // // // // // // //             );
// // // // // // // // // // //           })}
// // // // // // // // // // //           {submitError && (
// // // // // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // // // // //           )}
// // // // // // // // // // //           <div className="flex justify-end">
// // // // // // // // // // //             <Button
// // // // // // // // // // //               type="submit"
// // // // // // // // // // //               color="blue"
// // // // // // // // // // //               disabled={loading}
// // // // // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // // // // //             >
// // // // // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // // // // //             </Button>
// // // // // // // // // // //           </div>
// // // // // // // // // // //         </form>
// // // // // // // // // // //       </div>
// // // // // // // // // // //     </div>
// // // // // // // // // // //   );
// // // // // // // // // // // };

// // // // // // // // // // // export default SubmitEnquiryForm;

// // // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // // // //   const { formId } = useParams();
// // // // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // // // //   const selectOptions = {
// // // // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // // // //     school: ["City High School", "Central Academy", "Other"], // Added for QR code form
// // // // // // // // // //   };

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const fetchForm = async () => {
// // // // // // // // // //       try {
// // // // // // // // // //         console.log("Fetching form with ID:", formId);
// // // // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // // // //         if (formSnap.exists()) {
// // // // // // // // // //           console.log("Form data:", formSnap.data());
// // // // // // // // // //           setFormData(formSnap.data());
// // // // // // // // // //           const initialValues = {};
// // // // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // // // //           });
// // // // // // // // // //           setFormValues(initialValues);
// // // // // // // // // //         } else {
// // // // // // // // // //           console.error("Form not found for ID:", formId);
// // // // // // // // // //           setSubmitError("Form not found");
// // // // // // // // // //         }
// // // // // // // // // //       } catch (err) {
// // // // // // // // // //         console.error("Error fetching form:", err);
// // // // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // // // //       }
// // // // // // // // // //     };
// // // // // // // // // //     fetchForm();
// // // // // // // // // //   }, [formId]);

// // // // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // // // //     console.log(`Field ${fieldId} changed to:`, value);
// // // // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // // // //     if (errors[fieldId]) {
// // // // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const validateForm = () => {
// // // // // // // // // //     console.log("Validating form with values:", formValues);
// // // // // // // // // //     const newErrors = {};
// // // // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // // // //       }
// // // // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // // // //         }
// // // // // // // // // //       }
// // // // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // // // //       }
// // // // // // // // // //     });
// // // // // // // // // //     setErrors(newErrors);
// // // // // // // // // //     console.log("Validation errors:", newErrors);
// // // // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // // // //   };

// // // // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // // // //     e.preventDefault();
// // // // // // // // // //     console.log("Submitting form with values:", formValues);
// // // // // // // // // //     if (!validateForm()) {
// // // // // // // // // //       console.log("Validation failed, aborting submission");
// // // // // // // // // //       return;
// // // // // // // // // //     }
// // // // // // // // // //     try {
// // // // // // // // // //       setLoading(true);
// // // // // // // // // //       setSubmitError(null);

// // // // // // // // // //       // Prepare enquiry data
// // // // // // // // // //       const enquiryData = {
// // // // // // // // // //         formId,
// // // // // // // // // //         ...formValues,
// // // // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // // //       };
// // // // // // // // // //       console.log("Prepared enquiry data:", enquiryData);

// // // // // // // // // //       // Check for existing enquiry by email
// // // // // // // // // //       const email = formValues.email?.trim();
// // // // // // // // // //       let existingEnquiry = null;

// // // // // // // // // //       if (email) {
// // // // // // // // // //         console.log("Checking for existing enquiry with email:", email);
// // // // // // // // // //         const enquiriesRef = collection(db, "enquiries");
// // // // // // // // // //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // // // // //         const emailSnapshot = await getDocs(emailQuery);
// // // // // // // // // //         if (!emailSnapshot.empty) {
// // // // // // // // // //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // // // // // // // // //           console.log("Found existing enquiry:", existingEnquiry);
// // // // // // // // // //         } else {
// // // // // // // // // //           console.log("No existing enquiry found for email:", email);
// // // // // // // // // //         }
// // // // // // // // // //       } else {
// // // // // // // // // //         console.log("No email provided in form values");
// // // // // // // // // //       }

// // // // // // // // // //       if (existingEnquiry) {
// // // // // // // // // //         // Completely overwrite existing enquiry, preserving only createdAt
// // // // // // // // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // // // //         const updatedData = {
// // // // // // // // // //           ...enquiryData,
// // // // // // // // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // // // // //         };
// // // // // // // // // //         console.log("Overwriting enquiry with data:", updatedData);
// // // // // // // // // //         await setDoc(enquiryRef, updatedData, { merge: false });
// // // // // // // // // //         console.log(`Successfully overwrote enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // // // //       } else {
// // // // // // // // // //         // Create new enquiry
// // // // // // // // // //         console.log("Creating new enquiry with data:", enquiryData);
// // // // // // // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // // //         console.log("Created new enquiry with ID:", newDocRef.id);
// // // // // // // // // //       }

// // // // // // // // // //       setSubmitted(true);
// // // // // // // // // //       setFormValues(
// // // // // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // // // // //           return acc;
// // // // // // // // // //         }, {})
// // // // // // // // // //       );
// // // // // // // // // //       console.log("Form reset after successful submission");
// // // // // // // // // //     } catch (err) {
// // // // // // // // // //       console.error("Error submitting enquiry:", err);
// // // // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // // //     } finally {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   if (submitError) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   if (!formData) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   if (submitted) {
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // // // //           <Button
// // // // // // // // // //             color="blue"
// // // // // // // // // //             className="mt-4"
// // // // // // // // // //             onClick={() => {
// // // // // // // // // //               setSubmitted(false);
// // // // // // // // // //               setFormValues(
// // // // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // // // //                   return acc;
// // // // // // // // // //                 }, {})
// // // // // // // // // //               );
// // // // // // // // // //               console.log("Resetting form for another submission");
// // // // // // // // // //             }}
// // // // // // // // // //           >
// // // // // // // // // //             Submit Another
// // // // // // // // // //           </Button>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   }

// // // // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // // // //           {formData.fields.map((field) => {
// // // // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // // //             if (!fieldDef) {
// // // // // // // // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // // // // // //               return null;
// // // // // // // // // //             }

// // // // // // // // // //             const isError = !!errors[field.id];

// // // // // // // // // //             return (
// // // // // // // // // //               <div key={field.id}>
// // // // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // // // //                   <div>
// // // // // // // // // //                     <label
// // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // //                     >
// // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // //                     </label>
// // // // // // // // // //                     <textarea
// // // // // // // // // //                       id={field.id}
// // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // //                       rows={4}
// // // // // // // // // //                       disabled={loading}
// // // // // // // // // //                     />
// // // // // // // // // //                   </div>
// // // // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // // // //                     <Select
// // // // // // // // // //                       id={field.id}
// // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // //                       label={fieldDef.label}
// // // // // // // // // //                       disabled={loading}
// // // // // // // // // //                     >
// // // // // // // // // //                       <MenuItem value="">
// // // // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // // // //                       </MenuItem>
// // // // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // // // //                           {option}
// // // // // // // // // //                         </MenuItem>
// // // // // // // // // //                       ))}
// // // // // // // // // //                     </Select>
// // // // // // // // // //                   </FormControl>
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   <div>
// // // // // // // // // //                     <label
// // // // // // // // // //                       htmlFor={field.id}
// // // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // // //                     >
// // // // // // // // // //                       {fieldDef.label}
// // // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // // //                     </label>
// // // // // // // // // //                     <input
// // // // // // // // // //                       type={fieldDef.type}
// // // // // // // // // //                       id={field.id}
// // // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // // //                       disabled={loading}
// // // // // // // // // //                     />
// // // // // // // // // //                   </div>
// // // // // // // // // //                 )}
// // // // // // // // // //                 {isError && (
// // // // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // // // //                 )}
// // // // // // // // // //               </div>
// // // // // // // // // //             );
// // // // // // // // // //           })}
// // // // // // // // // //           {submitError && (
// // // // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // // // //           )}
// // // // // // // // // //           <div className="flex justify-end">
// // // // // // // // // //             <Button
// // // // // // // // // //               type="submit"
// // // // // // // // // //               color="blue"
// // // // // // // // // //               disabled={loading}
// // // // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // // // //             >
// // // // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // // // //             </Button>
// // // // // // // // // //           </div>
// // // // // // // // // //         </form>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default SubmitEnquiryForm;


// // // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // // //   const { formId } = useParams();
// // // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // // //   const selectOptions = {
// // // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // // //     school: ["City High School", "Central Academy", "Other"],
// // // // // // // // //   };

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const fetchForm = async () => {
// // // // // // // // //       try {
// // // // // // // // //         console.log("Fetching form with ID:", formId);
// // // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // // //         if (formSnap.exists()) {
// // // // // // // // //           console.log("Form data:", formSnap.data());
// // // // // // // // //           setFormData(formSnap.data());
// // // // // // // // //           const initialValues = {};
// // // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // // //           });
// // // // // // // // //           setFormValues(initialValues);
// // // // // // // // //         } else {
// // // // // // // // //           console.error("Form not found for ID:", formId);
// // // // // // // // //           setSubmitError("Form not found");
// // // // // // // // //         }
// // // // // // // // //       } catch (err) {
// // // // // // // // //         console.error("Error fetching form:", err);
// // // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // // //       }
// // // // // // // // //     };
// // // // // // // // //     fetchForm();
// // // // // // // // //   }, [formId]);

// // // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // // //     console.log(`Field ${fieldId} changed to:`, value);
// // // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // // //     if (errors[fieldId]) {
// // // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   const validateForm = () => {
// // // // // // // // //     console.log("Validating form with values:", formValues);
// // // // // // // // //     const newErrors = {};
// // // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // // //       }
// // // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // // //         }
// // // // // // // // //       }
// // // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // // //       }
// // // // // // // // //     });
// // // // // // // // //     setErrors(newErrors);
// // // // // // // // //     console.log("Validation errors:", newErrors);
// // // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // // //   };

// // // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // // //     e.preventDefault();
// // // // // // // // //     console.log("Submitting form with values:", formValues);
// // // // // // // // //     if (!validateForm()) {
// // // // // // // // //       console.log("Validation failed, aborting submission");
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     try {
// // // // // // // // //       setLoading(true);
// // // // // // // // //       setSubmitError(null);

// // // // // // // // //       // Prepare enquiry data
// // // // // // // // //       const enquiryData = {
// // // // // // // // //         formId,
// // // // // // // // //         ...formValues,
// // // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // // //       };
// // // // // // // // //       console.log("Prepared enquiry data:", enquiryData);

// // // // // // // // //       // Normalize email for matching
// // // // // // // // //       const email = formValues.email?.trim().toLowerCase();
// // // // // // // // //       let existingEnquiry = null;

// // // // // // // // //       if (email) {
// // // // // // // // //         console.log("Checking for existing enquiry with email:", email);
// // // // // // // // //         const enquiriesRef = collection(db, "enquiries");
// // // // // // // // //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // // // //         const emailSnapshot = await getDocs(emailQuery);

// // // // // // // // //         if (!emailSnapshot.empty) {
// // // // // // // // //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // // // // // // // //           console.log("Found existing enquiry:", existingEnquiry);
// // // // // // // // //           // Log all matching documents (in case there are duplicates)
// // // // // // // // //           emailSnapshot.forEach((doc) => {
// // // // // // // // //             console.log("Matching enquiry document:", { id: doc.id, ...doc.data() });
// // // // // // // // //           });
// // // // // // // // //         } else {
// // // // // // // // //           console.log("No existing enquiry found for email:", email);
// // // // // // // // //         }
// // // // // // // // //       } else {
// // // // // // // // //         console.log("No email provided in form values");
// // // // // // // // //         throw new Error("Email is required to submit the enquiry");
// // // // // // // // //       }

// // // // // // // // //       if (existingEnquiry) {
// // // // // // // // //         // Completely overwrite existing enquiry, preserving only createdAt
// // // // // // // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // // //         const updatedData = {
// // // // // // // // //           ...enquiryData,
// // // // // // // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // // // //         };
// // // // // // // // //         console.log("Before overwrite - existing data:", existingEnquiry);
// // // // // // // // //         console.log("Overwriting with data:", updatedData);
// // // // // // // // //         await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // // // // //         // Verify the update
// // // // // // // // //         const updatedDoc = await getDoc(enquiryRef);
// // // // // // // // //         console.log("After overwrite - new data:", updatedDoc.data());
// // // // // // // // //         console.log(`Successfully overwrote enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // // //       } else {
// // // // // // // // //         // Create new enquiry
// // // // // // // // //         console.log("Creating new enquiry with data:", enquiryData);
// // // // // // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // // //         console.log("Created new enquiry with ID:", newDocRef.id);
// // // // // // // // //       }

// // // // // // // // //       setSubmitted(true);
// // // // // // // // //       setFormValues(
// // // // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // // // //           return acc;
// // // // // // // // //         }, {})
// // // // // // // // //       );
// // // // // // // // //       console.log("Form reset after successful submission");
// // // // // // // // //     } catch (err) {
// // // // // // // // //       console.error("Error submitting enquiry:", err);
// // // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // // //     } finally {
// // // // // // // // //       setLoading(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   if (submitError) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (!formData) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   if (submitted) {
// // // // // // // // //     return (
// // // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // // //           <Button
// // // // // // // // //             color="blue"
// // // // // // // // //             className="mt-4"
// // // // // // // // //             onClick={() => {
// // // // // // // // //               setSubmitted(false);
// // // // // // // // //               setFormValues(
// // // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // // //                   return acc;
// // // // // // // // //                 }, {})
// // // // // // // // //               );
// // // // // // // // //               console.log("Resetting form for another submission");
// // // // // // // // //             }}
// // // // // // // // //           >
// // // // // // // // //             Submit Another
// // // // // // // // //           </Button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   }

// // // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // // //   return (
// // // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // // //           {formData.fields.map((field) => {
// // // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // // //             if (!fieldDef) {
// // // // // // // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // // // // //               return null;
// // // // // // // // //             }

// // // // // // // // //             const isError = !!errors[field.id];

// // // // // // // // //             return (
// // // // // // // // //               <div key={field.id}>
// // // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // // //                   <div>
// // // // // // // // //                     <label
// // // // // // // // //                       htmlFor={field.id}
// // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // //                     >
// // // // // // // // //                       {fieldDef.label}
// // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // //                     </label>
// // // // // // // // //                     <textarea
// // // // // // // // //                       id={field.id}
// // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // //                       rows={4}
// // // // // // // // //                       disabled={loading}
// // // // // // // // //                     />
// // // // // // // // //                   </div>
// // // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // // //                     <Select
// // // // // // // // //                       id={field.id}
// // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // //                       label={fieldDef.label}
// // // // // // // // //                       disabled={loading}
// // // // // // // // //                     >
// // // // // // // // //                       <MenuItem value="">
// // // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // // //                       </MenuItem>
// // // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // // //                           {option}
// // // // // // // // //                         </MenuItem>
// // // // // // // // //                       ))}
// // // // // // // // //                     </Select>
// // // // // // // // //                   </FormControl>
// // // // // // // // //                 ) : (
// // // // // // // // //                   <div>
// // // // // // // // //                     <label
// // // // // // // // //                       htmlFor={field.id}
// // // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // // //                     >
// // // // // // // // //                       {fieldDef.label}
// // // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // // //                     </label>
// // // // // // // // //                     <input
// // // // // // // // //                       type={fieldDef.type}
// // // // // // // // //                       id={field.id}
// // // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // // //                       disabled={loading}
// // // // // // // // //                     />
// // // // // // // // //                   </div>
// // // // // // // // //                 )}
// // // // // // // // //                 {isError && (
// // // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // // //                 )}
// // // // // // // // //               </div>
// // // // // // // // //             );
// // // // // // // // //           })}
// // // // // // // // //           {submitError && (
// // // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // // //           )}
// // // // // // // // //           <div className="flex justify-end">
// // // // // // // // //             <Button
// // // // // // // // //               type="submit"
// // // // // // // // //               color="blue"
// // // // // // // // //               disabled={loading}
// // // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // // //             >
// // // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // // //             </Button>
// // // // // // // // //           </div>
// // // // // // // // //         </form>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default SubmitEnquiryForm;


// // // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // // import { useParams } from "react-router-dom";
// // // // // // // // import { db } from "../../../config/firebase";
// // // // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
// // // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // // const SubmitEnquiryForm = () => {
// // // // // // // //   const { formId } = useParams();
// // // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // // //   const [errors, setErrors] = useState({});
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // // //   const selectOptions = {
// // // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // // //     school: ["City High School", "Central Academy", "Other"],
// // // // // // // //   };

// // // // // // // //   useEffect(() => {
// // // // // // // //     const fetchForm = async () => {
// // // // // // // //       try {
// // // // // // // //         console.log("Fetching form with ID:", formId);
// // // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // // //         if (formSnap.exists()) {
// // // // // // // //           console.log("Form data:", formSnap.data());
// // // // // // // //           setFormData(formSnap.data());
// // // // // // // //           const initialValues = {};
// // // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // // //           });
// // // // // // // //           setFormValues(initialValues);
// // // // // // // //         } else {
// // // // // // // //           console.error("Form not found for ID:", formId);
// // // // // // // //           setSubmitError("Form not found");
// // // // // // // //         }
// // // // // // // //       } catch (err) {
// // // // // // // //         console.error("Error fetching form:", err);
// // // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // // //       }
// // // // // // // //     };
// // // // // // // //     fetchForm();
// // // // // // // //   }, [formId]);

// // // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // // //     console.log(`Field ${fieldId} changed to:`, value);
// // // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // // //     if (errors[fieldId]) {
// // // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const validateForm = () => {
// // // // // // // //     console.log("Validating form with values:", formValues);
// // // // // // // //     const newErrors = {};
// // // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // // //     formData.fields.forEach((field) => {
// // // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // // //       }
// // // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // // //         }
// // // // // // // //       }
// // // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // // //       }
// // // // // // // //     });
// // // // // // // //     setErrors(newErrors);
// // // // // // // //     console.log("Validation errors:", newErrors);
// // // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // // //   };

// // // // // // // //   const handleSubmit = async (e) => {
// // // // // // // //     e.preventDefault();
// // // // // // // //     console.log("Submitting form with values:", formValues);
// // // // // // // //     if (!validateForm()) {
// // // // // // // //       console.log("Validation failed, aborting submission");
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       setSubmitError(null);

// // // // // // // //       // Prepare enquiry data
// // // // // // // //       const enquiryData = {
// // // // // // // //         formId,
// // // // // // // //         ...formValues,
// // // // // // // //         status: formValues.stage || "prequalified",
// // // // // // // //         createdAt: serverTimestamp(),
// // // // // // // //         updatedAt: serverTimestamp(),
// // // // // // // //       };
// // // // // // // //       console.log("Prepared enquiry data:", enquiryData);

// // // // // // // //       // Normalize email for matching
// // // // // // // //       const email = formValues.email?.trim().toLowerCase();
// // // // // // // //       console.log("Normalized email for query:", email);

// // // // // // // //       if (!email) {
// // // // // // // //         console.log("No email provided in form values");
// // // // // // // //         throw new Error("Email is required to submit the enquiry");
// // // // // // // //       }

// // // // // // // //       // Check for existing enquiry by email
// // // // // // // //       let existingEnquiries = [];
// // // // // // // //       console.log("Checking for existing enquiry with email:", email);
// // // // // // // //       const enquiriesRef = collection(db, "enquiries");
// // // // // // // //       const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // // //       const emailSnapshot = await getDocs(emailQuery);

// // // // // // // //       if (!emailSnapshot.empty) {
// // // // // // // //         emailSnapshot.forEach((doc) => {
// // // // // // // //           const enquiry = { id: doc.id, ...doc.data() };
// // // // // // // //           existingEnquiries.push(enquiry);
// // // // // // // //           console.log("Found matching enquiry:", enquiry);
// // // // // // // //         });
// // // // // // // //       } else {
// // // // // // // //         console.log("No existing enquiry found for email:", email);
// // // // // // // //       }

// // // // // // // //       if (existingEnquiries.length > 0) {
// // // // // // // //         // Handle multiple matches (shouldn't happen after cleanup, but just in case)
// // // // // // // //         if (existingEnquiries.length > 1) {
// // // // // // // //           console.warn("Multiple enquiries found for email:", email, existingEnquiries);
// // // // // // // //           // Keep the oldest enquiry and delete the rest
// // // // // // // //           const sortedEnquiries = existingEnquiries.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
// // // // // // // //           const keepEnquiry = sortedEnquiries[0];
// // // // // // // //           const deleteEnquiries = sortedEnquiries.slice(1);

// // // // // // // //           const batch = writeBatch(db);
// // // // // // // //           deleteEnquiries.forEach((enquiry) => {
// // // // // // // //             console.log("Deleting duplicate enquiry:", enquiry.id);
// // // // // // // //             batch.delete(doc(db, "enquiries", enquiry.id));
// // // // // // // //           });
// // // // // // // //           await batch.commit();
// // // // // // // //           console.log("Deleted duplicate enquiries, proceeding with overwrite");

// // // // // // // //           // Overwrite the kept enquiry
// // // // // // // //           const enquiryRef = doc(db, "enquiries", keepEnquiry.id);
// // // // // // // //           const updatedData = {
// // // // // // // //             ...enquiryData,
// // // // // // // //             createdAt: keepEnquiry.createdAt || serverTimestamp(),
// // // // // // // //           };
// // // // // // // //           console.log("Before overwrite - existing data:", keepEnquiry);
// // // // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // // // //           // Verify the update
// // // // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // // // //           console.log(`Successfully overwrote enquiry with ID: ${keepEnquiry.id}`);
// // // // // // // //         } else {
// // // // // // // //           // Single existing enquiry
// // // // // // // //           const existingEnquiry = existingEnquiries[0];
// // // // // // // //           const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // // //           const updatedData = {
// // // // // // // //             ...enquiryData,
// // // // // // // //             createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // // //           };
// // // // // // // //           console.log("Before overwrite - existing data:", existingEnquiry);
// // // // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // // // //           // Verify the update
// // // // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // // // //           console.log(`Successfully overwrote enquiry with ID: ${existingEnquiry.id}`);
// // // // // // // //         }
// // // // // // // //       } else {
// // // // // // // //         // Create new enquiry
// // // // // // // //         console.log("Creating new enquiry with data:", enquiryData);
// // // // // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // // //         console.log("Created new enquiry with ID:", newDocRef.id);
// // // // // // // //       }

// // // // // // // //       setSubmitted(true);
// // // // // // // //       setFormValues(
// // // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // // //           return acc;
// // // // // // // //         }, {})
// // // // // // // //       );
// // // // // // // //       console.log("Form reset after successful submission");
// // // // // // // //     } catch (err) {
// // // // // // // //       console.error("Error submitting enquiry:", err);
// // // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   if (submitError) {
// // // // // // // //     return (
// // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (!formData) {
// // // // // // // //     return (
// // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   if (submitted) {
// // // // // // // //     return (
// // // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // // //           <Button
// // // // // // // //             color="blue"
// // // // // // // //             className="mt-4"
// // // // // // // //             onClick={() => {
// // // // // // // //               setSubmitted(false);
// // // // // // // //               setFormValues(
// // // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // // //                   return acc;
// // // // // // // //                 }, {})
// // // // // // // //               );
// // // // // // // //               console.log("Resetting form for another submission");
// // // // // // // //             }}
// // // // // // // //           >
// // // // // // // //             Submit Another
// // // // // // // //           </Button>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // // //   return (
// // // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // // //           {formData.fields.map((field) => {
// // // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // // //             if (!fieldDef) {
// // // // // // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // // // //               return null;
// // // // // // // //             }

// // // // // // // //             const isError = !!errors[field.id];

// // // // // // // //             return (
// // // // // // // //               <div key={field.id}>
// // // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // // //                   <div>
// // // // // // // //                     <label
// // // // // // // //                       htmlFor={field.id}
// // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // //                     >
// // // // // // // //                       {fieldDef.label}
// // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // //                     </label>
// // // // // // // //                     <textarea
// // // // // // // //                       id={field.id}
// // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // //                       rows={4}
// // // // // // // //                       disabled={loading}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // // //                     <Select
// // // // // // // //                       id={field.id}
// // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // //                       label={fieldDef.label}
// // // // // // // //                       disabled={loading}
// // // // // // // //                     >
// // // // // // // //                       <MenuItem value="">
// // // // // // // //                         <em>Select {fieldDef.label}</em>
// // // // // // // //                       </MenuItem>
// // // // // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // // //                         <MenuItem key={option} value={option}>
// // // // // // // //                           {option}
// // // // // // // //                         </MenuItem>
// // // // // // // //                       ))}
// // // // // // // //                     </Select>
// // // // // // // //                   </FormControl>
// // // // // // // //                 ) : (
// // // // // // // //                   <div>
// // // // // // // //                     <label
// // // // // // // //                       htmlFor={field.id}
// // // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // // //                     >
// // // // // // // //                       {fieldDef.label}
// // // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // // //                     </label>
// // // // // // // //                     <input
// // // // // // // //                       type={fieldDef.type}
// // // // // // // //                       id={field.id}
// // // // // // // //                       value={formValues[field.id] || ""}
// // // // // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // // //                       className={`w-full px-3 py-2 border ${
// // // // // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // // //                       disabled={loading}
// // // // // // // //                     />
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //                 {isError && (
// // // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // // //                 )}
// // // // // // // //               </div>
// // // // // // // //             );
// // // // // // // //           })}
// // // // // // // //           {submitError && (
// // // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // // //           )}
// // // // // // // //           <div className="flex justify-end">
// // // // // // // //             <Button
// // // // // // // //               type="submit"
// // // // // // // //               color="blue"
// // // // // // // //               disabled={loading}
// // // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // // //             >
// // // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // // //             </Button>
// // // // // // // //           </div>
// // // // // // // //         </form>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default SubmitEnquiryForm;



// // // // // // // import React, { useState, useEffect } from "react";
// // // // // // // import { useParams } from "react-router-dom";
// // // // // // // import { db } from "../../../config/firebase";
// // // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
// // // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // // const SubmitEnquiryForm = () => {
// // // // // // //   const { formId } = useParams();
// // // // // // //   const [formData, setFormData] = useState(null);
// // // // // // //   const [formValues, setFormValues] = useState({});
// // // // // // //   const [errors, setErrors] = useState({});
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // // //   const selectOptions = {
// // // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // // //     studentType: ["School", "College", "Professional"],
// // // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // // //     school: ["City High School", "Central Academy", "Other"],
// // // // // // //   };

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchForm = async () => {
// // // // // // //       try {
// // // // // // //         console.log("Fetching form with ID:", formId);
// // // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // // //         const formSnap = await getDoc(formRef);
// // // // // // //         if (formSnap.exists()) {
// // // // // // //           console.log("Form data:", formSnap.data());
// // // // // // //           setFormData(formSnap.data());
// // // // // // //           const initialValues = {};
// // // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // // //           });
// // // // // // //           setFormValues(initialValues);
// // // // // // //         } else {
// // // // // // //           console.error("Form not found for ID:", formId);
// // // // // // //           setSubmitError("Form not found");
// // // // // // //         }
// // // // // // //       } catch (err) {
// // // // // // //         console.error("Error fetching form:", err);
// // // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // // //       }
// // // // // // //     };
// // // // // // //     fetchForm();
// // // // // // //   }, [formId]);

// // // // // // //   const handleChange = (fieldId, value) => {
// // // // // // //     console.log(`Field ${fieldId} changed to:`, value);
// // // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // // //     if (errors[fieldId]) {
// // // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const validateForm = () => {
// // // // // // //     console.log("Validating form with values:", formValues);
// // // // // // //     const newErrors = {};
// // // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // // //     formData.fields.forEach((field) => {
// // // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // // //       }
// // // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // // //         }
// // // // // // //       }
// // // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // // //       }
// // // // // // //     });
// // // // // // //     setErrors(newErrors);
// // // // // // //     console.log("Validation errors:", newErrors);
// // // // // // //     return Object.keys(newErrors).length === 0;
// // // // // // //   };

// // // // // // //   const handleSubmit = async (e) => {
// // // // // // //     e.preventDefault();
// // // // // // //     console.log("Submitting form with values:", formValues);
// // // // // // //     if (!validateForm()) {
// // // // // // //       console.log("Validation failed, aborting submission");
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     try {
// // // // // // //       setLoading(true);
// // // // // // //       setSubmitError(null);

// // // // // // //       // Prepare enquiry data
// // // // // // //       const enquiryData = {
// // // // // // //         formId,
// // // // // // //         ...formValues,
// // // // // // //         status: formValues.stage || "prequalified",
// // // // // // //         createdAt: serverTimestamp(),
// // // // // // //         updatedAt: serverTimestamp(),
// // // // // // //       };
// // // // // // //       console.log("Prepared enquiry data:", enquiryData);

// // // // // // //       // Normalize email for matching
// // // // // // //       const email = formValues.email?.trim().toLowerCase();
// // // // // // //       console.log("Normalized email for query:", email);

// // // // // // //       if (!email) {
// // // // // // //         console.log("No email provided in form values");
// // // // // // //         throw new Error("Email is required to submit the enquiry");
// // // // // // //       }

// // // // // // //       // Check for existing enquiry by email
// // // // // // //       let existingEnquiries = [];
// // // // // // //       console.log("Checking for existing enquiry with email:", email);
// // // // // // //       const enquiriesRef = collection(db, "enquiries");
// // // // // // //       const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // // //       const emailSnapshot = await getDocs(emailQuery);

// // // // // // //       if (!emailSnapshot.empty) {
// // // // // // //         emailSnapshot.forEach((doc) => {
// // // // // // //           const enquiry = { id: doc.id, ...doc.data() };
// // // // // // //           existingEnquiries.push(enquiry);
// // // // // // //           console.log("Found matching enquiry:", enquiry);
// // // // // // //         });
// // // // // // //       } else {
// // // // // // //         console.log("No existing enquiry found for email:", email);
// // // // // // //       }

// // // // // // //       if (existingEnquiries.length > 0) {
// // // // // // //         // Handle multiple matches (shouldn't happen after cleanup, but just in case)
// // // // // // //         if (existingEnquiries.length > 1) {
// // // // // // //           console.warn("Multiple enquiries found for email:", email, existingEnquiries);
// // // // // // //           // Keep the oldest enquiry and delete the rest
// // // // // // //           const sortedEnquiries = existingEnquiries.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
// // // // // // //           const keepEnquiry = sortedEnquiries[0];
// // // // // // //           const deleteEnquiries = sortedEnquiries.slice(1);

// // // // // // //           const batch = writeBatch(db);
// // // // // // //           deleteEnquiries.forEach((enquiry) => {
// // // // // // //             console.log("Deleting duplicate enquiry:", enquiry.id);
// // // // // // //             batch.delete(doc(db, "enquiries", enquiry.id));
// // // // // // //           });
// // // // // // //           await batch.commit();
// // // // // // //           console.log("Deleted duplicate enquiries, proceeding with overwrite");

// // // // // // //           // Overwrite the kept enquiry
// // // // // // //           const enquiryRef = doc(db, "enquiries", keepEnquiry.id);
// // // // // // //           const updatedData = {
// // // // // // //             ...enquiryData,
// // // // // // //             createdAt: keepEnquiry.createdAt || serverTimestamp(),
// // // // // // //           };
// // // // // // //           console.log("Before overwrite - existing data:", keepEnquiry);
// // // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // // //           // Verify the update
// // // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // // //           console.log(`Successfully overwrote enquiry with ID: ${keepEnquiry.id}`);
// // // // // // //         } else {
// // // // // // //           // Single existing enquiry
// // // // // // //           const existingEnquiry = existingEnquiries[0];
// // // // // // //           const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // // //           const updatedData = {
// // // // // // //             ...enquiryData,
// // // // // // //             createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // // //           };
// // // // // // //           console.log("Before overwrite - existing data:", existingEnquiry);
// // // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // // //           // Verify the update
// // // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // // //           console.log(`Successfully overwrote enquiry with ID: ${existingEnquiry.id}`);
// // // // // // //         }
// // // // // // //       } else {
// // // // // // //         // Create new enquiry
// // // // // // //         console.log("Creating new enquiry with data:", enquiryData);
// // // // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // // //         console.log("Created new enquiry with ID:", newDocRef.id);
// // // // // // //       }

// // // // // // //       setSubmitted(true);
// // // // // // //       setFormValues(
// // // // // // //         formData.fields.reduce((acc, field) => {
// // // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // // //           return acc;
// // // // // // //         }, {})
// // // // // // //       );
// // // // // // //       console.log("Form reset after successful submission");
// // // // // // //     } catch (err) {
// // // // // // //       console.error("Error submitting enquiry:", err);
// // // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   if (submitError) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (!formData) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   if (submitted) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // // //           <Button
// // // // // // //             color="blue"
// // // // // // //             className="mt-4"
// // // // // // //             onClick={() => {
// // // // // // //               setSubmitted(false);
// // // // // // //               setFormValues(
// // // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // // //                   return acc;
// // // // // // //                 }, {})
// // // // // // //               );
// // // // // // //               console.log("Resetting form for another submission");
// // // // // // //             }}
// // // // // // //           >
// // // // // // //             Submit Another
// // // // // // //           </Button>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // // //   return (
// // // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // // // //           {formData.fields.map((field) => {
// // // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // // //             if (!fieldDef) {
// // // // // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // // //               return null;
// // // // // // //             }

// // // // // // //             const isError = !!errors[field.id];
// // // // // // //             const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

// // // // // // //             return (
// // // // // // //               <div key={field.id}>
// // // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // // //   <div>
// // // // // // //     <label
// // // // // // //       htmlFor={field.id}
// // // // // // //       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // //     >
// // // // // // //       {fieldDef.label}
// // // // // // //       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // //     </label>
// // // // // // //     <textarea
// // // // // // //       id={field.id}
// // // // // // //       value={formValues[field.id] || ""}
// // // // // // //       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //       className={`w-full px-3 py-2 border ${
// // // // // // //         isError ? "border-red-500" : "border-gray-300"
// // // // // // //       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// // // // // // //         hasDefaultValue ? "bg-gray-100 cursor-not-allowed" : ""
// // // // // // //       }`}
// // // // // // //       rows={4}
// // // // // // //       disabled={loading || hasDefaultValue}
// // // // // // //     />
// // // // // // //   </div>
// // // // // // // ) : fieldDef.type === "select" ? (
// // // // // // //   <FormControl fullWidth error={isError}>
// // // // // // //     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // //     <Select
// // // // // // //       id={field.id}
// // // // // // //       value={formValues[field.id] || ""}
// // // // // // //       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //       label={fieldDef.label}
// // // // // // //       disabled={loading || hasDefaultValue}
// // // // // // //       className={hasDefaultValue ? "bg-gray-100 cursor-not-allowed" : ""}
// // // // // // //     >
// // // // // // //       <MenuItem value="">
// // // // // // //         <em>Select {fieldDef.label}</em>
// // // // // // //       </MenuItem>
// // // // // // //       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // //         <MenuItem key={option} value={option}>
// // // // // // //           {option}
// // // // // // //         </MenuItem>
// // // // // // //       ))}
// // // // // // //     </Select>
// // // // // // //   </FormControl>
// // // // // // // ) : (
// // // // // // //   <div>
// // // // // // //     <label
// // // // // // //       htmlFor={field.id}
// // // // // // //       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // //     >
// // // // // // //       {fieldDef.label}
// // // // // // //       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // //     </label>
// // // // // // //     <input
// // // // // // //       type={fieldDef.type}
// // // // // // //       id={field.id}
// // // // // // //       value={formValues[field.id] || ""}
// // // // // // //       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //       className={`w-full px-3 py-2 border ${
// // // // // // //         isError ? "border-red-500" : "border-gray-300"
// // // // // // //       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// // // // // // //         hasDefaultValue ? "bg-gray-100 cursor-not-allowed" : ""
// // // // // // //       }`}
// // // // // // //       disabled={loading || hasDefaultValue}
// // // // // // //     />
// // // // // // //   </div>
// // // // // // // )}
// // // // // // //                 {/* {fieldDef.type === "textarea" ? (
// // // // // // //                   <div>
// // // // // // //                     <label
// // // // // // //                       htmlFor={field.id}
// // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // //                     >
// // // // // // //                       {fieldDef.label}
// // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // //                     </label>
// // // // // // //                     {hasDefaultValue ? (
// // // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // // //                         {field.defaultValue}
// // // // // // //                       </p>
// // // // // // //                     ) : (
// // // // // // //                       <textarea
// // // // // // //                         id={field.id}
// // // // // // //                         value={formValues[field.id] || ""}
// // // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //                         className={`w-full px-3 py-2 border ${
// // // // // // //                           isError ? "border-red-500" : "border-gray-300"
// // // // // // //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // //                         rows={4}
// // // // // // //                         disabled={loading}
// // // // // // //                       />
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // // //                   <FormControl fullWidth error={isError}>
// // // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // // //                     {hasDefaultValue ? (
// // // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // // //                         {field.defaultValue}
// // // // // // //                       </p>
// // // // // // //                     ) : (
// // // // // // //                       <Select
// // // // // // //                         id={field.id}
// // // // // // //                         value={formValues[field.id] || ""}
// // // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //                         label={fieldDef.label}
// // // // // // //                         disabled={loading}
// // // // // // //                       >
// // // // // // //                         <MenuItem value="">
// // // // // // //                           <em>Select {fieldDef.label}</em>
// // // // // // //                         </MenuItem>
// // // // // // //                         {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // // //                           <MenuItem key={option} value={option}>
// // // // // // //                             {option}
// // // // // // //                           </MenuItem>
// // // // // // //                         ))}
// // // // // // //                       </Select>
// // // // // // //                     )}
// // // // // // //                   </FormControl>
// // // // // // //                 ) : (
// // // // // // //                   <div>
// // // // // // //                     <label
// // // // // // //                       htmlFor={field.id}
// // // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // // //                     >
// // // // // // //                       {fieldDef.label}
// // // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // // //                     </label>
// // // // // // //                     {hasDefaultValue ? (
// // // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // // //                         {field.defaultValue}
// // // // // // //                       </p>
// // // // // // //                     ) : (
// // // // // // //                       <input
// // // // // // //                         type={fieldDef.type}
// // // // // // //                         id={field.id}
// // // // // // //                         value={formValues[field.id] || ""}
// // // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // // //                         className={`w-full px-3 py-2 border ${
// // // // // // //                           isError ? "border-red-500" : "border-gray-300"
// // // // // // //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // // //                         disabled={loading}
// // // // // // //                       />
// // // // // // //                     )}
// // // // // // //                   </div>
// // // // // // //                 )} */}
// // // // // // //                 {isError && (
// // // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // // //                 )}
// // // // // // //               </div>
// // // // // // //             );
// // // // // // //           })}
// // // // // // //           {submitError && (
// // // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // // //           )}
// // // // // // //           <div className="flex justify-end">
// // // // // // //             <Button
// // // // // // //               type="submit"
// // // // // // //               color="blue"
// // // // // // //               disabled={loading}
// // // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // // //             >
// // // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // // //             </Button>
// // // // // // //           </div>
// // // // // // //         </form>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default SubmitEnquiryForm;


// // // // // // import React, { useState, useEffect } from "react";
// // // // // // import { useParams } from "react-router-dom";
// // // // // // import { db } from "../../../config/firebase";
// // // // // // import { doc, getDoc, addDoc, setDoc, collection, query, where, getDocs, serverTimestamp, writeBatch } from "firebase/firestore";
// // // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // // const SubmitEnquiryForm = () => {
// // // // // //   const { formId } = useParams();
// // // // // //   const [formData, setFormData] = useState(null);
// // // // // //   const [formValues, setFormValues] = useState({});
// // // // // //   const [errors, setErrors] = useState({});
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [submitError, setSubmitError] = useState(null);
// // // // // //   const [submitted, setSubmitted] = useState(false);

// // // // // //   const selectOptions = {
// // // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // // //     studentType: ["School", "College", "Professional"],
// // // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // // //     school: ["City High School", "Central Academy", "Other"],
// // // // // //   };

// // // // // //   useEffect(() => {
// // // // // //     const fetchForm = async () => {
// // // // // //       try {
// // // // // //         console.log("Fetching form with ID:", formId);
// // // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // // //         const formSnap = await getDoc(formRef);
// // // // // //         if (formSnap.exists()) {
// // // // // //           console.log("Form data:", formSnap.data());
// // // // // //           setFormData(formSnap.data());
// // // // // //           const initialValues = {};
// // // // // //           formSnap.data().fields.forEach((field) => {
// // // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // // //           });
// // // // // //           setFormValues(initialValues);
// // // // // //         } else {
// // // // // //           console.error("Form not found for ID:", formId);
// // // // // //           setSubmitError("Form not found");
// // // // // //         }
// // // // // //       } catch (err) {
// // // // // //         console.error("Error fetching form:", err);
// // // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // // //       }
// // // // // //     };
// // // // // //     fetchForm();
// // // // // //   }, [formId]);

// // // // // //   const handleChange = (fieldId, value) => {
// // // // // //     console.log(`Field ${fieldId} changed to:`, value);
// // // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // // //     if (errors[fieldId]) {
// // // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // // //     }
// // // // // //   };

// // // // // //   const validateForm = () => {
// // // // // //     console.log("Validating form with values:", formValues);
// // // // // //     const newErrors = {};
// // // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // // //     formData.fields.forEach((field) => {
// // // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // // //       }
// // // // // //       if (fieldDef?.type === "email" && formValues[field.id]) {
// // // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // // //           newErrors[field.id] = "Invalid email format";
// // // // // //         }
// // // // // //       }
// // // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // // //       }
// // // // // //     });
// // // // // //     setErrors(newErrors);
// // // // // //     console.log("Validation errors:", newErrors);
// // // // // //     return Object.keys(newErrors).length === 0;
// // // // // //   };

// // // // // //   const handleSubmit = async (e) => {
// // // // // //     e.preventDefault();
// // // // // //     console.log("Submitting form with values:", formValues);
// // // // // //     if (!validateForm()) {
// // // // // //       console.log("Validation failed, aborting submission");
// // // // // //       return;
// // // // // //     }
// // // // // //     try {
// // // // // //       setLoading(true);
// // // // // //       setSubmitError(null);

// // // // // //       // Prepare enquiry data
// // // // // //       const enquiryData = {
// // // // // //         formId,
// // // // // //         ...formValues,
// // // // // //         status: formValues.stage || "prequalified",
// // // // // //         createdAt: serverTimestamp(),
// // // // // //         updatedAt: serverTimestamp(),
// // // // // //       };
// // // // // //       console.log("Prepared enquiry data:", enquiryData);

// // // // // //       // Normalize email for matching
// // // // // //       const email = formValues.email?.trim().toLowerCase();
// // // // // //       console.log("Normalized email for query:", email);

// // // // // //       if (!email) {
// // // // // //         console.log("No email provided in form values");
// // // // // //         throw new Error("Email is required to submit the enquiry");
// // // // // //       }

// // // // // //       // Check for existing enquiry by email
// // // // // //       let existingEnquiries = [];
// // // // // //       console.log("Checking for existing enquiry with email:", email);
// // // // // //       const enquiriesRef = collection(db, "enquiries");
// // // // // //       const emailQuery = query(enquiriesRef, where("email", "==", email));
// // // // // //       const emailSnapshot = await getDocs(emailQuery);

// // // // // //       if (!emailSnapshot.empty) {
// // // // // //         emailSnapshot.forEach((doc) => {
// // // // // //           const enquiry = { id: doc.id, ...doc.data() };
// // // // // //           existingEnquiries.push(enquiry);
// // // // // //           console.log("Found matching enquiry:", enquiry);
// // // // // //         });
// // // // // //       } else {
// // // // // //         console.log("No existing enquiry found for email:", email);
// // // // // //       }

// // // // // //       if (existingEnquiries.length > 0) {
// // // // // //         // Handle multiple matches (shouldn't happen after cleanup, but just in case)
// // // // // //         if (existingEnquiries.length > 1) {
// // // // // //           console.warn("Multiple enquiries found for email:", email, existingEnquiries);
// // // // // //           // Keep the oldest enquiry and delete the rest
// // // // // //           const sortedEnquiries = existingEnquiries.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
// // // // // //           const keepEnquiry = sortedEnquiries[0];
// // // // // //           const deleteEnquiries = sortedEnquiries.slice(1);

// // // // // //           const batch = writeBatch(db);
// // // // // //           deleteEnquiries.forEach((enquiry) => {
// // // // // //             console.log("Deleting duplicate enquiry:", enquiry.id);
// // // // // //             batch.delete(doc(db, "enquiries", enquiry.id));
// // // // // //           });
// // // // // //           await batch.commit();
// // // // // //           console.log("Deleted duplicate enquiries, proceeding with overwrite");

// // // // // //           // Overwrite the kept enquiry
// // // // // //           const enquiryRef = doc(db, "enquiries", keepEnquiry.id);
// // // // // //           const updatedData = {
// // // // // //             ...enquiryData,
// // // // // //             createdAt: keepEnquiry.createdAt || serverTimestamp(),
// // // // // //           };
// // // // // //           console.log("Before overwrite - existing data:", keepEnquiry);
// // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // //           // Verify the update
// // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // //           console.log(`Successfully overwrote enquiry with ID: ${keepEnquiry.id}`);
// // // // // //         } else {
// // // // // //           // Single existing enquiry
// // // // // //           const existingEnquiry = existingEnquiries[0];
// // // // // //           const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // // //           const updatedData = {
// // // // // //             ...enquiryData,
// // // // // //             createdAt: existingEnquiry.createdAt || serverTimestamp(),
// // // // // //           };
// // // // // //           console.log("Before overwrite - existing data:", existingEnquiry);
// // // // // //           console.log("Overwriting with data:", updatedData);
// // // // // //           await setDoc(enquiryRef, updatedData, { merge: false });

// // // // // //           // Verify the update
// // // // // //           const updatedDoc = await getDoc(enquiryRef);
// // // // // //           console.log("After overwrite - new data:", updatedDoc.data());
// // // // // //           console.log(`Successfully overwrote enquiry with ID: ${existingEnquiry.id}`);
// // // // // //         }
// // // // // //       } else {
// // // // // //         // Create new enquiry
// // // // // //         console.log("Creating new enquiry with data:", enquiryData);
// // // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // // //         console.log("Created new enquiry with ID:", newDocRef.id);
// // // // // //       }

// // // // // //       setSubmitted(true);
// // // // // //       setFormValues(
// // // // // //         formData.fields.reduce((acc, field) => {
// // // // // //           acc[field.id] = field.defaultValue || "";
// // // // // //           return acc;
// // // // // //         }, {})
// // // // // //       );
// // // // // //       console.log("Form reset after successful submission");
// // // // // //     } catch (err) {
// // // // // //       console.error("Error submitting enquiry:", err);
// // // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   if (submitError) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (!formData) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   if (submitted) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // // //           <h2 className="text-xl font-semibold text-green-600">Enquiry Submitted Successfully!</h2>
// // // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // // //           <Button
// // // // // //             color="blue"
// // // // // //             className="mt-4"
// // // // // //             onClick={() => {
// // // // // //               setSubmitted(false);
// // // // // //               setFormValues(
// // // // // //                 formData.fields.reduce((acc, field) => {
// // // // // //                   acc[field.id] = field.defaultValue || "";
// // // // // //                   return acc;
// // // // // //                 }, {})
// // // // // //               );
// // // // // //               console.log("Resetting form for another submission");
// // // // // //             }}
// // // // // //           >
// // // // // //             Submit Another
// // // // // //           </Button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // // //         <form onSubmit={handleSubmit} className="space-y-4">

// // // // // //         {formData.fields.map((field) => {
// // // // // //   const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // //   if (!fieldDef) {
// // // // // //     console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // //     return null;
// // // // // //   }

// // // // // //   const isError = !!errors[field.id];
// // // // // //   const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";
// // // // // //   const isReadOnly = hasDefaultValue;

// // // // // //   return (
// // // // // //     <div key={field.id}>
// // // // // //       {fieldDef.type === "textarea" ? (
// // // // // //         <div>
// // // // // //           <label htmlFor={field.id} className="block text-gray-700 text-sm font-medium mb-2">
// // // // // //             {fieldDef.label}
// // // // // //             {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // //           </label>
// // // // // //           {isReadOnly ? (
// // // // // //             <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //               {field.defaultValue}
// // // // // //             </p>
// // // // // //           ) : (
// // // // // //             <textarea
// // // // // //               id={field.id}
// // // // // //               value={formValues[field.id] || ""}
// // // // // //               onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //               className={`w-full px-3 py-2 border ${
// // // // // //                 isError ? "border-red-500" : "border-gray-300"
// // // // // //               } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // //               rows={4}
// // // // // //               disabled={loading}
// // // // // //             />
// // // // // //           )}
// // // // // //         </div>
// // // // // //       ) : fieldDef.type === "select" ? (
// // // // // //         <FormControl fullWidth error={isError}>
// // // // // //           <InputLabel>{fieldDef.label}</InputLabel>
// // // // // //           {isReadOnly ? (
// // // // // //             <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //               {field.defaultValue}
// // // // // //             </p>
// // // // // //           ) : (
// // // // // //             <Select
// // // // // //               id={field.id}
// // // // // //               value={formValues[field.id] || ""}
// // // // // //               onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //               label={fieldDef.label}
// // // // // //               disabled={loading}
// // // // // //             >
// // // // // //               <MenuItem value="">
// // // // // //                 <em>Select {fieldDef.label}</em>
// // // // // //               </MenuItem>
// // // // // //               {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // //                 <MenuItem key={option} value={option}>
// // // // // //                   {option}
// // // // // //                 </MenuItem>
// // // // // //               ))}
// // // // // //             </Select>
// // // // // //           )}
// // // // // //         </FormControl>
// // // // // //       ) : (
// // // // // //         <div>
// // // // // //           <label htmlFor={field.id} className="block text-gray-700 text-sm font-medium mb-2">
// // // // // //             {fieldDef.label}
// // // // // //             {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // //           </label>
// // // // // //           {isReadOnly ? (
// // // // // //             <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //               {field.defaultValue}
// // // // // //             </p>
// // // // // //           ) : (
// // // // // //             <input
// // // // // //               type={fieldDef.type}
// // // // // //               id={field.id}
// // // // // //               value={formValues[field.id] || ""}
// // // // // //               onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //               className={`w-full px-3 py-2 border ${
// // // // // //                 isError ? "border-red-500" : "border-gray-300"
// // // // // //               } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // //               disabled={loading}
// // // // // //             />
// // // // // //           )}
// // // // // //         </div>
// // // // // //       )}
// // // // // //       {isError && <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>}
// // // // // //     </div>
// // // // // //   );
// // // // // // })}


// // // // // //           {/* {formData.fields.map((field) => {
// // // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // // //             if (!fieldDef) {
// // // // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // // // //               return null;
// // // // // //             }

// // // // // //             const isError = !!errors[field.id];
// // // // // //             const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

// // // // // //             return (
// // // // // //               <div key={field.id}>
// // // // // //                 {fieldDef.type === "textarea" ? (
// // // // // //                   <div>
// // // // // //                     <label
// // // // // //                       htmlFor={field.id}
// // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // //                     >
// // // // // //                       {fieldDef.label}
// // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // //                     </label>
// // // // // //                     {hasDefaultValue ? (
// // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //                         {field.defaultValue}
// // // // // //                       </p>
// // // // // //                     ) : (
// // // // // //                       <textarea
// // // // // //                         id={field.id}
// // // // // //                         value={formValues[field.id] || ""}
// // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //                         className={`w-full px-3 py-2 border ${
// // // // // //                           isError ? "border-red-500" : "border-gray-300"
// // // // // //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // //                         rows={4}
// // // // // //                         disabled={loading}
// // // // // //                       />
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 ) : fieldDef.type === "select" ? (
// // // // // //                   <FormControl fullWidth error={isError}>
// // // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // // //                     {hasDefaultValue ? (
// // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //                         {field.defaultValue}
// // // // // //                       </p>
// // // // // //                     ) : (
// // // // // //                       <Select
// // // // // //                         id={field.id}
// // // // // //                         value={formValues[field.id] || ""}
// // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //                         label={fieldDef.label}
// // // // // //                         disabled={loading}
// // // // // //                       >
// // // // // //                         <MenuItem value="">
// // // // // //                           <em>Select {fieldDef.label}</em>
// // // // // //                         </MenuItem>
// // // // // //                         {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // // //                           <MenuItem key={option} value={option}>
// // // // // //                             {option}
// // // // // //                           </MenuItem>
// // // // // //                         ))}
// // // // // //                       </Select>
// // // // // //                     )}
// // // // // //                   </FormControl>
// // // // // //                 ) : (
// // // // // //                   <div>
// // // // // //                     <label
// // // // // //                       htmlFor={field.id}
// // // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // // //                     >
// // // // // //                       {fieldDef.label}
// // // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // // //                     </label>
// // // // // //                     {hasDefaultValue ? (
// // // // // //                       <p className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600">
// // // // // //                         {field.defaultValue}
// // // // // //                       </p>
// // // // // //                     ) : (
// // // // // //                       <input
// // // // // //                         type={fieldDef.type}
// // // // // //                         id={field.id}
// // // // // //                         value={formValues[field.id] || ""}
// // // // // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // // // // //                         className={`w-full px-3 py-2 border ${
// // // // // //                           isError ? "border-red-500" : "border-gray-300"
// // // // // //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // // //                         disabled={loading}
// // // // // //                       />
// // // // // //                     )}
// // // // // //                   </div>
// // // // // //                 )}
// // // // // //                 {isError && (
// // // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             );
// // // // // //           })} */}
// // // // // //           {submitError && (
// // // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // // //           )}
// // // // // //           <div className="flex justify-end">
// // // // // //             <Button
// // // // // //               type="submit"
// // // // // //               color="blue"
// // // // // //               disabled={loading}
// // // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // // //             >
// // // // // //               {loading ? "Submitting..." : "Submit"}
// // // // // //             </Button>
// // // // // //           </div>
// // // // // //         </form>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default SubmitEnquiryForm;




// // // // // import React, { useState, useEffect } from "react";
// // // // // import { useParams } from "react-router-dom";
// // // // // import { db } from "../../../config/firebase";
// // // // // import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // // import { Button, Input } from "@material-tailwind/react";
// // // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // // const SubmitEnquiryForm = () => {
// // // // //   const { formId } = useParams();
// // // // //   const [formData, setFormData] = useState(null);
// // // // //   const [formValues, setFormValues] = useState({});
// // // // //   const [errors, setErrors] = useState({});
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [submitError, setSubmitError] = useState(null);
// // // // //   const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });

// // // // //   // Sample options for select fields, matching FormViewer.js fallback
// // // // //   const selectOptions = {
// // // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // // //     studentType: ["School", "College", "Professional"],
// // // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // // //     source: ["Website", "Referral", "Advertisement"],
// // // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // // //   };

// // // // //   useEffect(() => {
// // // // //     const fetchForm = async () => {
// // // // //       try {
// // // // //         const formRef = doc(db, "enquiryForms", formId);
// // // // //         const formSnap = await getDoc(formRef);
// // // // //         if (formSnap.exists()) {
// // // // //           setFormData(formSnap.data());
// // // // //           // Initialize form values with default values
// // // // //           const initialValues = {};
// // // // //           formSnap.data().fields.forEach((field) => {
// // // // //             initialValues[field.id] = field.defaultValue || "";
// // // // //           });
// // // // //           setFormValues(initialValues);
// // // // //         } else {
// // // // //           setSubmitError("Form not found");
// // // // //         }
// // // // //       } catch (err) {
// // // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // // //       }
// // // // //     };
// // // // //     fetchForm();
// // // // //   }, [formId]);

// // // // //   const handleChange = (fieldId, value) => {
// // // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // // //     if (errors[fieldId]) {
// // // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // // //     }
// // // // //   };

// // // // //   const validateForm = () => {
// // // // //     const newErrors = {};
// // // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // // //     formData.fields.forEach((field) => {
// // // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // //       if (fieldDef?.required && !formValues[field.id]?.trim()) {
// // // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // // //       }
// // // // //       if (fieldDef?.id === "email" && formValues[field.id]) {
// // // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // //         if (!emailRegex.test(formValues[field.id])) {
// // // // //           newErrors[field.id] = "Invalid email format";
// // // // //         }
// // // // //       }
// // // // //       if (fieldDef?.id === "phone" && formValues[field.id]) {
// // // // //         const phoneRegex = /^\d{10}$/;
// // // // //         if (!phoneRegex.test(formValues[field.id])) {
// // // // //           newErrors[field.id] = "Phone number must be 10 digits";
// // // // //         }
// // // // //       }
// // // // //       if (fieldDef?.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // // //       }
// // // // //     });
// // // // //     setErrors(newErrors);
// // // // //     return Object.keys(newErrors).length === 0;
// // // // //   };

// // // // //   const handleSubmit = async (e) => {
// // // // //     e.preventDefault();
// // // // //     if (!validateForm()) {
// // // // //       return;
// // // // //     }
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       setSubmitError(null);

// // // // //       // Prepare enquiry data
// // // // //       const enquiryData = {
// // // // //         formId,
// // // // //         ...formValues,
// // // // //         status: formValues.stage || "prequalified",
// // // // //         createdAt: serverTimestamp(),
// // // // //         updatedAt: serverTimestamp(),
// // // // //       };

// // // // //       // Check for existing enquiry by email or phone
// // // // //       const email = formValues.email?.trim().toLowerCase();
// // // // //       const phone = formValues.phone?.trim();
// // // // //       let existingEnquiry = null;

// // // // //       if (email || phone) {
// // // // //         const enquiriesRef = collection(db, "enquiries");
// // // // //         const queries = [];
// // // // //         if (email) {
// // // // //           queries.push(query(enquiriesRef, where("email", "==", email), limit(1)));
// // // // //         }
// // // // //         if (phone) {
// // // // //           queries.push(query(enquiriesRef, where("phone", "==", phone), limit(1)));
// // // // //         }

// // // // //         // Execute queries
// // // // //         const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));
// // // // //         for (const snapshot of querySnapshots) {
// // // // //           if (!snapshot.empty) {
// // // // //             existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
// // // // //             break; // Take the first match
// // // // //           }
// // // // //         }
// // // // //         console.log("Existing Enquiry:", existingEnquiry);
// // // // //       } else {
// // // // //         console.log("No email or phone provided, creating new enquiry");
// // // // //       }

// // // // //       if (existingEnquiry) {
// // // // //         // Update existing enquiry
// // // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // // //         const updatedData = {
// // // // //           ...existingEnquiry, // Preserve existing fields
// // // // //           ...enquiryData, // Overwrite with new form values
// // // // //           updatedAt: serverTimestamp(),
// // // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(), // Preserve original createdAt
// // // // //         };
// // // // //         await updateDoc(enquiryRef, updatedData);
// // // // //         console.log(`Updated enquiry with ID: ${existingEnquiry.id}`);
// // // // //         setSubmitted({ success: true, isUpdate: true });
// // // // //       } else {
// // // // //         // Create new enquiry
// // // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // // //         console.log(`Created new enquiry with ID: ${newDocRef.id}`);
// // // // //         setSubmitted({ success: true, isUpdate: false });
// // // // //       }

// // // // //       // Reset form to default values
// // // // //       setFormValues(
// // // // //         formData.fields.reduce((acc, field) => {
// // // // //           acc[field.id] = field.defaultValue || "";
// // // // //           return acc;
// // // // //         }, {})
// // // // //       );
// // // // //     } catch (err) {
// // // // //       console.error("Submission error:", err);
// // // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   if (submitError) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (!formData) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   if (submitted.success) {
// // // // //     return (
// // // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // // //           <h2 className="text-xl font-semibold text-green-600">
// // // // //             {submitted.isUpdate ? "Enquiry Updated Successfully!" : "Enquiry Submitted Successfully!"}
// // // // //           </h2>
// // // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // // //           <Button
// // // // //             color="blue"
// // // // //             className="mt-4"
// // // // //             onClick={() => {
// // // // //               setSubmitted({ success: false, isUpdate: false });
// // // // //               setFormValues(
// // // // //                 formData.fields.reduce((acc, field) => {
// // // // //                   acc[field.id] = field.defaultValue || "";
// // // // //                   return acc;
// // // // //                 }, {})
// // // // //               );
// // // // //             }}
// // // // //           >
// // // // //             Submit Another
// // // // //           </Button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // // //   return (
// // // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // // //           {formData.fields.map((field) => {
// // // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // // //             if (!fieldDef) return null;

// // // // //             const isError = !!errors[field.id];

// // // // //             return (
// // // // //               <div key={field.id}>
// // // // //                 {fieldDef.type === "textarea" ? (
// // // // //                   <div>
// // // // //                     <label
// // // // //                       htmlFor={field.id}
// // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // //                     >
// // // // //                       {fieldDef.label}
// // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // //                     </label>
// // // // //                     <textarea
// // // // //                       id={field.id}
// // // // //                       value={formValues[field.id] || ""}
// // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // //                       className={`w-full px-3 py-2 border ${
// // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // //                       rows={4}
// // // // //                       disabled={loading}
// // // // //                     />
// // // // //                   </div>
// // // // //                 ) : fieldDef.type === "select" ? (
// // // // //                   <FormControl fullWidth error={isError}>
// // // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // // //                     <Select
// // // // //                       id={field.id}
// // // // //                       value={formValues[field.id] || ""}
// // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // //                       label={fieldDef.label}
// // // // //                       disabled={loading}
// // // // //                     >
// // // // //                       <MenuItem value="">
// // // // //                         <em>Select {fieldDef.label}</em>
// // // // //                       </MenuItem>
// // // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // // //                         <MenuItem key={option} value={option}>
// // // // //                           {option}
// // // // //                         </MenuItem>
// // // // //                       ))}
// // // // //                     </Select>
// // // // //                   </FormControl>
// // // // //                 ) : (
// // // // //                   <div>
// // // // //                     <label
// // // // //                       htmlFor={field.id}
// // // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // // //                     >
// // // // //                       {fieldDef.label}
// // // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // // //                     </label>
// // // // //                     <input
// // // // //                       type={fieldDef.type}
// // // // //                       id={field.id}
// // // // //                       value={formValues[field.id] || ""}
// // // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // // //                       className={`w-full px-3 py-2 border ${
// // // // //                         isError ? "border-red-500" : "border-gray-300"
// // // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // // // //                       disabled={loading}
// // // // //                     />
// // // // //                   </div>
// // // // //                 )}
// // // // //                 {isError && (
// // // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // // //                 )}
// // // // //               </div>
// // // // //             );
// // // // //           })}
// // // // //           {submitError && (
// // // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // // //           )}
// // // // //           <div className="flex justify-end">
// // // // //             <Button
// // // // //               type="submit"
// // // // //               color="blue"
// // // // //               disabled={loading}
// // // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // // //             >
// // // // //               {loading ? "Submitting..." : "Submit"}
// // // // //             </Button>
// // // // //           </div>
// // // // //         </form>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default SubmitEnquiryForm;



// // // // import React, { useState, useEffect } from "react";
// // // // import { useParams } from "react-router-dom";
// // // // import { db } from "../../../config/firebase";
// // // // import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
// // // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // // import { Button, Input } from "@material-tailwind/react";
// // // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // // const SubmitEnquiryForm = () => {
// // // //   const { formId } = useParams();
// // // //   const [formData, setFormData] = useState(null);
// // // //   const [formValues, setFormValues] = useState({});
// // // //   const [errors, setErrors] = useState({});
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [submitError, setSubmitError] = useState(null);
// // // //   const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });

// // // //   // Sample options for select fields, matching FormViewer.js fallback
// // // //   const selectOptions = {
// // // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // // //     studentType: ["School", "College", "Professional"],
// // // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // // //     branch: ["Main Branch", "City Branch", "Online"],
// // // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // // //     source: ["Website", "Referral", "Advertisement"],
// // // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // // //     degree: ["Bachelors", "Masters", "Diploma"],
// // // //     stage: ["prequalified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // // //   };

// // // //   useEffect(() => {
// // // //     const fetchForm = async () => {
// // // //       try {
// // // //         const formRef = doc(db, "enquiryForms", formId);
// // // //         const formSnap = await getDoc(formRef);
// // // //         if (formSnap.exists()) {
// // // //           const data = formSnap.data();
// // // //           console.log("Fetched form data:", data);
// // // //           setFormData(data);
// // // //           // Initialize form values with default values
// // // //           const initialValues = {};
// // // //           data.fields.forEach((field) => {
// // // //             initialValues[field.id] = field.defaultValue || "";
// // // //           });
// // // //           setFormValues(initialValues);
// // // //         } else {
// // // //           setSubmitError("Form not found");
// // // //         }
// // // //       } catch (err) {
// // // //         setSubmitError(`Error fetching form: ${err.message}`);
// // // //       }
// // // //     };
// // // //     fetchForm();
// // // //   }, [formId]);

// // // //   const handleChange = (fieldId, value) => {
// // // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // // //     if (errors[fieldId]) {
// // // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // // //     }
// // // //   };

// // // //   const validateForm = () => {
// // // //     const newErrors = {};
// // // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // // //     formData.fields.forEach((field) => {
// // // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // // //       if (!fieldDef) return;

// // // //       // Skip validation for disabled fields (non-empty defaultValue)
// // // //       const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// // // //       if (isDisabled) return;

// // // //       // Validate required fields
// // // //       if (fieldDef.required && !formValues[field.id]?.trim()) {
// // // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // // //       }
// // // //       // Validate email format
// // // //       if (fieldDef.id === "email" && formValues[field.id]) {
// // // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // //         if (!emailRegex.test(formValues[field.id])) {
// // // //           newErrors[field.id] = "Invalid email format";
// // // //         }
// // // //       }
// // // //       // Validate phone format
// // // //       if (fieldDef.id === "phone" && formValues[field.id]) {
// // // //         const phoneRegex = /^\d{10}$/;
// // // //         if (!phoneRegex.test(formValues[field.id])) {
// // // //           newErrors[field.id] = "Phone number must be 10 digits";
// // // //         }
// // // //       }
// // // //       // Validate number fields
// // // //       if (fieldDef.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // // //       }
// // // //     });
// // // //     setErrors(newErrors);
// // // //     console.log("Validation errors:", newErrors);
// // // //     return Object.keys(newErrors).length === 0;
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     if (!validateForm()) {
// // // //       return;
// // // //     }
// // // //     try {
// // // //       setLoading(true);
// // // //       setSubmitError(null);

// // // //       // Prepare enquiry data
// // // //       const enquiryData = {
// // // //         formId,
// // // //         ...formValues,
// // // //         status: formValues.stage || "prequalified",
// // // //         createdAt: serverTimestamp(),
// // // //         updatedAt: serverTimestamp(),
// // // //       };

// // // //       // Check for existing enquiry by email or phone
// // // //       const email = formValues.email?.trim().toLowerCase();
// // // //       const phone = formValues.phone?.trim();
// // // //       let existingEnquiry = null;

// // // //       if (email || phone) {
// // // //         const enquiriesRef = collection(db, "enquiries");
// // // //         const queries = [];
// // // //         if (email) {
// // // //           queries.push(query(enquiriesRef, where("email", "==", email)));
// // // //         }
// // // //         if (phone) {
// // // //           queries.push(query(enquiriesRef, where("phone", "==", phone)));
// // // //         }

// // // //         // Execute queries
// // // //         const querySnapshots = await Promise.all(queries.map((q) => getDocs(q)));
// // // //         for (const snapshot of querySnapshots) {
// // // //           if (!snapshot.empty) {
// // // //             existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
// // // //             break; // Take the first match
// // // //           }
// // // //         }
// // // //         console.log("Existing Enquiry:", existingEnquiry);
// // // //       } else {
// // // //         console.log("No email or phone provided, creating new enquiry");
// // // //       }

// // // //       if (existingEnquiry) {
// // // //         // Update existing enquiry
// // // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // // //         const updatedData = {
// // // //           ...existingEnquiry, // Preserve existing fields
// // // //           ...enquiryData, // Overwrite with new form values
// // // //           updatedAt: serverTimestamp(),
// // // //           createdAt: existingEnquiry.createdAt || serverTimestamp(), // Preserve original createdAt
// // // //         };
// // // //         await updateDoc(enquiryRef, updatedData);
// // // //         console.log(`Updated enquiry with ID: ${existingEnquiry.id}`);
// // // //         setSubmitted({ success: true, isUpdate: true });
// // // //       } else {
// // // //         // Create new enquiry
// // // //         const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // // //         console.log(`Created new enquiry with ID: ${newDocRef.id}`);
// // // //         setSubmitted({ success: true, isUpdate: false });
// // // //       }

// // // //       // Reset form to default values
// // // //       setFormValues(
// // // //         formData.fields.reduce((acc, field) => {
// // // //           acc[field.id] = field.defaultValue || "";
// // // //           return acc;
// // // //         }, {})
// // // //       );
// // // //     } catch (err) {
// // // //       console.error("Submission error:", err);
// // // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   if (submitError) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (!formData) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   if (submitted.success) {
// // // //     return (
// // // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // // //           <h2 className="text-xl font-semibold text-green-600">
// // // //             {submitted.isUpdate ? "Enquiry Updated Successfully!" : "Enquiry Submitted Successfully!"}
// // // //           </h2>
// // // //           <p className="mt-2 text-gray-600">Thank you for your submission.</p>
// // // //           <Button
// // // //             color="blue"
// // // //             className="mt-4"
// // // //             onClick={() => {
// // // //               setSubmitted({ success: false, isUpdate: false });
// // // //               setFormValues(
// // // //                 formData.fields.reduce((acc, field) => {
// // // //                   acc[field.id] = field.defaultValue || "";
// // // //                   return acc;
// // // //                 }, {})
// // // //               );
// // // //             }}
// // // //           >
// // // //             Submit Another
// // // //           </Button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // // //   return (
// // // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // // //         <form onSubmit={handleSubmit} className="space-y-4">
// // // //           {formData.fields.map((field) => {
// // // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // // //             if (!fieldDef) {
// // // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // // //               return null;
// // // //             }

// // // //             const isError = !!errors[field.id];
// // // //             // Disable field if defaultValue is non-empty
// // // //             const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// // // //             console.log(`Rendering field ${field.id}:`, {
// // // //               defaultValue: field.defaultValue,
// // // //               isDisabled,
// // // //               value: formValues[field.id],
// // // //             });

// // // //             return (
// // // //               <div key={field.id}>
// // // //                 {fieldDef.type === "textarea" ? (
// // // //                   <div>
// // // //                     <label
// // // //                       htmlFor={field.id}
// // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // //                     >
// // // //                       {fieldDef.label}
// // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // //                     </label>
// // // //                     <textarea
// // // //                       id={field.id}
// // // //                       value={formValues[field.id] || ""}
// // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // //                       className={`w-full px-3 py-2 border ${
// // // //                         isError ? "border-red-500" : "border-gray-300"
// // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// // // //                         isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// // // //                       }`}
// // // //                       rows={4}
// // // //                       disabled={loading || isDisabled}
// // // //                     />
// // // //                   </div>
// // // //                 ) : fieldDef.type === "select" ? (
// // // //                   <FormControl fullWidth error={isError}>
// // // //                     <InputLabel>{fieldDef.label}</InputLabel>
// // // //                     <Select
// // // //                       id={field.id}
// // // //                       value={formValues[field.id] || ""}
// // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // //                       label={fieldDef.label}
// // // //                       disabled={loading || isDisabled}
// // // //                       className={isDisabled ? "bg-gray-100" : ""}
// // // //                     >
// // // //                       <MenuItem value="">
// // // //                         <em>Select {fieldDef.label}</em>
// // // //                       </MenuItem>
// // // //                       {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // // //                         <MenuItem key={option} value={option}>
// // // //                           {option}
// // // //                         </MenuItem>
// // // //                       ))}
// // // //                     </Select>
// // // //                   </FormControl>
// // // //                 ) : (
// // // //                   <div>
// // // //                     <label
// // // //                       htmlFor={field.id}
// // // //                       className="block text-gray-700 text-sm font-medium mb-2"
// // // //                     >
// // // //                       {fieldDef.label}
// // // //                       {fieldDef.required && <span className="text-red-500">*</span>}
// // // //                     </label>
// // // //                     <input
// // // //                       type={fieldDef.type}
// // // //                       id={field.id}
// // // //                       value={formValues[field.id] || ""}
// // // //                       onChange={(e) => handleChange(field.id, e.target.value)}
// // // //                       className={`w-full px-3 py-2 border ${
// // // //                         isError ? "border-red-500" : "border-gray-300"
// // // //                       } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
// // // //                         isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// // // //                       }`}
// // // //                       disabled={loading || isDisabled}
// // // //                     />
// // // //                   </div>
// // // //                 )}
// // // //                 {isError && (
// // // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // // //                 )}
// // // //               </div>
// // // //             );
// // // //           })}
// // // //           {submitError && (
// // // //             <p className="text-sm text-red-500">{submitError}</p>
// // // //           )}
// // // //           <div className="flex justify-end">
// // // //             <Button
// // // //               type="submit"
// // // //               color="blue"
// // // //               disabled={loading}
// // // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // // //             >
// // // //               {loading ? "Submitting..." : "Submit"}
// // // //             </Button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default SubmitEnquiryForm;


// // // import React, { useState, useEffect } from "react";
// // // import { useParams } from "react-router-dom";
// // // import { db } from "../../../config/firebase";
// // // import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
// // // import { allEnquiryFields } from "./enquiryFields.jsx";
// // // import { Button, Input } from "@material-tailwind/react";
// // // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // // const SubmitEnquiryForm = () => {
// // //   const { formId } = useParams();
// // //   const [formData, setFormData] = useState(null);
// // //   const [formValues, setFormValues] = useState({});
// // //   const [errors, setErrors] = useState({});
// // //   const [loading, setLoading] = useState(false);
// // //   const [submitError, setSubmitError] = useState(null);
// // //   const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });
// // //   const [existingEnquiry, setExistingEnquiry] = useState(null);
// // //   const [showPrompt, setShowPrompt] = useState(false);

// // //   // const selectOptions = {
// // //   //   country: ["India", "USA", "UK", "Canada", "Australia"],
// // //   //   gender: ["Male", "Female", "Prefer not to disclose"],
// // //   //   studentType: ["School", "College", "Professional"],
// // //   //   graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // //   //   branch: ["Main Branch", "City Branch", "Online"],
// // //   //   course: ["Computer Science", "Business Studies", "Mathematics"],
// // //   //   source: ["Website", "Referral", "Advertisement"],
// // //   //   assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // //   //   degree: ["Bachelors", "Masters", "Diploma"],
// // //   //   stage: ["pre-qualified", "qualified", "negotiation", "closed won", "closed lost", "contact in future"],
// // //   // };

// // //   const selectOptions = {
// // //     country: ["India", "USA", "UK", "Canada", "Australia"],
// // //     gender: ["Male", "Female", "Prefer not to disclose"],
// // //     studentType: ["School", "College", "Professional"],
// // //     graduationStream: ["Science", "Commerce", "Arts", "Engineering"],
// // //     branch: ["Main Branch", "City Branch", "Online"],
// // //     course: ["Computer Science", "Business Studies", "Mathematics"],
// // //     source: ["Website", "Referral", "Advertisement"],
// // //     assignTo: ["Admissions Team", "Counselor A", "Counselor B"],
// // //     degree: ["Bachelors", "Masters", "Diploma"],
// // //     stage: ["pre-qualified", "qualified", "negotiation", "closed-won", "closed-lost", "contact-in-future"], // Updated to match Kanban column IDs
// // //   };


// // //   useEffect(() => {
// // //     const fetchForm = async () => {
// // //       try {
// // //         const formRef = doc(db, "enquiryForms", formId);
// // //         const formSnap = await getDoc(formRef);
// // //         if (formSnap.exists()) {
// // //           const data = formSnap.data();
// // //           console.log("Fetched form data:", data);
// // //           setFormData(data);
// // //           // Initialize form values with default values
// // //           const initialValues = {};
// // //           data.fields.forEach((field) => {
// // //             initialValues[field.id] = field.defaultValue || "";
// // //           });
// // //           setFormValues(initialValues);
// // //         } else {
// // //           setSubmitError("Form not found");
// // //         }
// // //       } catch (err) {
// // //         setSubmitError(`Error fetching form: ${err.message}`);
// // //       }
// // //     };
// // //     fetchForm();
// // //   }, [formId]);

// // //   const handleChange = (fieldId, value) => {
// // //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// // //     if (errors[fieldId]) {
// // //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// // //     }
// // //   };

// // //   const validateForm = () => {
// // //     const newErrors = {};
// // //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// // //     formData.fields.forEach((field) => {
// // //       const fieldDef = flatFields.find((f) => f.id === field.id);
// // //       if (!fieldDef) return;

// // //       // Skip validation for disabled fields (non-empty defaultValue)
// // //       const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// // //       if (isDisabled) return;

// // //       // Validate required fields
// // //       if (fieldDef.required && !formValues[field.id]?.trim()) {
// // //         newErrors[field.id] = `${fieldDef.label} is required`;
// // //       }
// // //       // Validate email format
// // //       if (fieldDef.id === "email" && formValues[field.id]) {
// // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //         if (!emailRegex.test(formValues[field.id])) {
// // //           newErrors[field.id] = "Invalid email format";
// // //         }
// // //       }
// // //       // Validate phone format
// // //       if (fieldDef.id === "phone" && formValues[field.id]) {
// // //         const phoneRegex = /^\d{10}$/;
// // //         if (!phoneRegex.test(formValues[field.id])) {
// // //           newErrors[field.id] = "Phone number must be 10 digits";
// // //         }
// // //       }
// // //       // Validate number fields
// // //       if (fieldDef.type === "number" && formValues[field.id] && isNaN(formValues[field.id])) {
// // //         newErrors[field.id] = `${fieldDef.label} must be a number`;
// // //       }
// // //     });
// // //     setErrors(newErrors);
// // //     console.log("Validation errors:", newErrors);
// // //     return Object.keys(newErrors).length === 0;
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     if (!validateForm()) {
// // //       return;
// // //     }
// // //     try {
// // //       setLoading(true);
// // //       setSubmitError(null);

// // //       // Check for existing enquiry by email
// // //       const email = formValues.email?.trim().toLowerCase();
// // //       let existing = null;

// // //       if (email) {
// // //         const enquiriesRef = collection(db, "enquiries");
// // //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// // //         const emailSnapshot = await getDocs(emailQuery);
// // //         if (!emailSnapshot.empty) {
// // //           existing = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // //           setExistingEnquiry(existing);
// // //           setShowPrompt(true);
// // //           setLoading(false);
// // //           return;
// // //         }
// // //       }

// // //       // If no existing enquiry, proceed to create a new one
// // //       await createNewEnquiry();
// // //     } catch (err) {
// // //       console.error("Submission error:", err);
// // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // //       setLoading(false);
// // //     }
// // //   };


// // //   const createNewEnquiry = async () => {
// // //     try {
// // //       setLoading(true);
// // //       setSubmitError(null);

// // //       const enquiryData = {
// // //         formId,
// // //         ...formValues,
// // //         stage: "pre-qualified", // Always set stage to "pre-qualified" for new enquiries
// // //         createdAt: serverTimestamp(),
// // //         updatedAt: serverTimestamp(),
// // //       };

// // //       const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// // //       console.log(`Created new enquiry with ID: ${newDocRef.id}`);
// // //       setSubmitted({ success: true, isUpdate: false });

// // //       setFormValues(
// // //         formData.fields.reduce((acc, field) => {
// // //           acc[field.id] = field.defaultValue || "";
// // //           return acc;
// // //         }, {})
// // //       );
// // //     } catch (err) {
// // //       console.error("Submission error:", err);
// // //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };
// // //   const handlePromptResponse = async (keepPrevious) => {
// // //     setShowPrompt(false);
// // //     try {
// // //       setLoading(true);
// // //       setSubmitError(null);

// // //       if (keepPrevious) {
// // //         // Keep the previous enquiry, do not create a new one
// // //         setSubmitted({ success: true, isUpdate: true });
// // //         console.log(`Kept existing enquiry with ID: ${existingEnquiry.id}`);
// // //         setFormValues(
// // //           formData.fields.reduce((acc, field) => {
// // //             acc[field.id] = field.defaultValue || "";
// // //             return acc;
// // //           }, {})
// // //         );
// // //       } else {
// // //         // Delete the existing enquiry
// // //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// // //         await deleteDoc(enquiryRef);
// // //         console.log(`Deleted existing enquiry with ID: ${existingEnquiry.id}`);

// // //         // Create a new enquiry
// // //         await createNewEnquiry();
// // //       }
// // //     } catch (err) {
// // //       console.error("Error handling prompt response:", err);
// // //       setSubmitError(`Error processing enquiry: ${err.message}`);
// // //     } finally {
// // //       setLoading(false);
// // //       setExistingEnquiry(null);
// // //     }
// // //   };

// // //   if (submitError) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!formData) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // //           <h2 className="text-xl font-semibold">Loading...</h2>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   if (submitted.success) {
// // //     return (
// // //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// // //           <h2 className="text-xl font-semibold text-green-600">
// // //             {submitted.isUpdate
// // //               ? "Existing Enquiry Retained!"
// // //               : "Enquiry Submitted Successfully!"}
// // //           </h2>
// // //           <p className="mt-2 text-gray-600">
// // //             {submitted.isUpdate
// // //               ? "The previous enquiry was retained as per your choice."
// // //               : "Thank you for your submission."}
// // //           </p>
// // //           <Button
// // //             color="blue"
// // //             className="mt-4"
// // //             onClick={() => {
// // //               setSubmitted({ success: false, isUpdate: false });
// // //               setFormValues(
// // //                 formData.fields.reduce((acc, field) => {
// // //                   acc[field.id] = field.defaultValue || "";
// // //                   return acc;
// // //                 }, {})
// // //               );
// // //             }}
// // //           >
// // //             Submit Another
// // //           </Button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// // //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// // //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// // //         <form onSubmit={handleSubmit} className="space-y-4">
// // //           {formData.fields.map((field) => {
// // //             const fieldDef = flatFields.find((f) => f.id === field.id);
// // //             if (!fieldDef) {
// // //               console.warn(`Field definition not found for ID: ${field.id}`);
// // //               return null;
// // //             }

// // //             const isError = !!errors[field.id];
// // //             const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// // //             console.log(`Rendering field ${field.id}:`, {
// // //               defaultValue: field.defaultValue,
// // //               isDisabled,
// // //               value: formValues[field.id],
// // //             });

// // //             return (
// // //               <div key={field.id}>
// // //                 {fieldDef.type === "textarea" ? (
// // //                   fieldDef.defaultValue === "" ?
// // //                     (<div>
// // //                       <label
// // //                         htmlFor={field.id}
// // //                         className="block text-gray-700 text-sm font-medium mb-2"
// // //                       >
// // //                         {fieldDef.label}
// // //                         {fieldDef.required && <span className="text-red-500">*</span>}
// // //                       </label>
// // //                       <textarea
// // //                         id={field.id}
// // //                         value={formValues[field.id] || ""}
// // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // //                         className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// // //                           } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// // //                           }`}
// // //                         rows={4}
// // //                         disabled={loading || isDisabled}
// // //                       />
// // //                     </div>) :
// // //                     (<div>
// // //                       <label
// // //                         htmlFor={field.id}
// // //                         className="block text-gray-700 text-sm font-medium mb-2"
// // //                       >
// // //                         {fieldDef.label}
// // //                         {fieldDef.required && <span className="text-red-500">*</span>}
// // //                       </label>
// // //                       <textarea
// // //                         id={field.id}
// // //                         value={formValues[field.id] || ""}
// // //                         readOnly
// // //                         // onChange={(e) => handleChange(field.id, e.target.value)}
// // //                         className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// // //                           } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// // //                         rows={4}
// // //                         disabled={loading}
// // //                       />
// // //                     </div>)
// // //                 )
// // //                   : fieldDef.type === "select" ? (
// // //                     <FormControl fullWidth error={isError}>
// // //                       <InputLabel>{fieldDef.label}</InputLabel>
// // //                       <Select
// // //                         id={field.id}
// // //                         value={formValues[field.id] || ""}
// // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // //                         label={fieldDef.label}
// // //                         disabled={loading || isDisabled}
// // //                         className={isDisabled ? "bg-gray-100" : ""}
// // //                       >
// // //                         <MenuItem value="">
// // //                           <em>Select {fieldDef.label}</em>
// // //                         </MenuItem>
// // //                         {(selectOptions[field.id] || ["Option 1", "Option 2"]).map((option) => (
// // //                           <MenuItem key={option} value={option}>
// // //                             {option}
// // //                           </MenuItem>
// // //                         ))}
// // //                       </Select>
// // //                     </FormControl>
// // //                   ) : (
// // //                     <div>
// // //                       <label
// // //                         htmlFor={field.id}
// // //                         className="block text-gray-700 text-sm font-medium mb-2"
// // //                       >
// // //                         {fieldDef.label}
// // //                         {fieldDef.required && <span className="text-red-500">*</span>}
// // //                       </label>
// // //                       <input
// // //                         type={fieldDef.type}
// // //                         id={field.id}
// // //                         value={formValues[field.id] || ""}
// // //                         onChange={(e) => handleChange(field.id, e.target.value)}
// // //                         className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// // //                           } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// // //                           }`}
// // //                         disabled={loading || isDisabled}
// // //                       />
// // //                     </div>
// // //                   )}
// // //                 {isError && (
// // //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// // //                 )}
// // //               </div>
// // //             );
// // //           })}
// // //           {submitError && (
// // //             <p className="text-sm text-red-500">{submitError}</p>
// // //           )}
// // //           <div className="flex justify-end">
// // //             <Button
// // //               type="submit"
// // //               color="blue"
// // //               disabled={loading}
// // //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// // //             >
// // //               {loading ? "Submitting..." : "Submit"}
// // //             </Button>
// // //           </div>
// // //         </form>

// // //         {/* Prompt for existing email */}
// // //         {showPrompt && (
// // //           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
// // //             <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
// // //               <h3 className="text-lg font-semibold mb-4">
// // //                 Duplicate Email Detected
// // //               </h3>
// // //               <p className="text-gray-600 mb-4">
// // //                 An enquiry with the email "{formValues.email}" already exists. Do you want to keep the previous enquiry or replace it with this new one?
// // //               </p>
// // //               <div className="flex justify-end space-x-2">
// // //                 <Button
// // //                   color="gray"
// // //                   onClick={() => handlePromptResponse(true)}
// // //                   disabled={loading}
// // //                 >
// // //                   Keep Previous
// // //                 </Button>
// // //                 <Button
// // //                   color="blue"
// // //                   onClick={() => handlePromptResponse(false)}
// // //                   disabled={loading}
// // //                 >
// // //                   Use Latest
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default SubmitEnquiryForm;


// // import React, { useState, useEffect } from "react";
// // import { useParams } from "react-router-dom";
// // import { db } from "../../../config/firebase";
// // import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
// // import { allEnquiryFields } from "./enquiryFields.jsx";
// // import { Button } from "@material-tailwind/react";
// // import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// // const SubmitEnquiryForm = () => {
// //   const { formId } = useParams();
// //   const [formData, setFormData] = useState(null);
// //   const [formValues, setFormValues] = useState({});
// //   const [errors, setErrors] = useState({});
// //   const [loading, setLoading] = useState(false);
// //   const [submitError, setSubmitError] = useState(null);
// //   const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });
// //   const [existingEnquiry, setExistingEnquiry] = useState(null);
// //   const [showPrompt, setShowPrompt] = useState(false);

// //   useEffect(() => {
// //     const fetchForm = async () => {
// //       try {
// //         const formRef = doc(db, "enquiryForms", formId);
// //         const formSnap = await getDoc(formRef);
// //         if (formSnap.exists()) {
// //           const data = formSnap.data();
// //           console.log("Fetched form data:", data);
// //           setFormData(data);
// //           // Initialize form values with default values
// //           const initialValues = {};
// //           data.fields.forEach((field) => {
// //             initialValues[field.id] = field.defaultValue || "";
// //           });
// //           setFormValues(initialValues);
// //         } else {
// //           setSubmitError("Form not found");
// //         }
// //       } catch (err) {
// //         setSubmitError(`Error fetching form: ${err.message}`);
// //       }
// //     };
// //     fetchForm();
// //   }, [formId]);

// //   const handleChange = (fieldId, value) => {
// //     setFormValues((prev) => ({ ...prev, [fieldId]: value }));
// //     if (errors[fieldId]) {
// //       setErrors((prev) => ({ ...prev, [fieldId]: null }));
// //     }
// //   };

// //   const validateForm = () => {
// //     const newErrors = {};
// //     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
// //     formData.fields.forEach((field) => {
// //       const fieldDef = flatFields.find((f) => f.id === field.id);
// //       if (!fieldDef) return;

// //       // Skip validation for disabled fields (non-empty defaultValue)
// //       const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// //       if (isDisabled) return;

// //       // Validate required fields
// //       if (fieldDef.required && !formValues[field.id]?.trim()) {
// //         newErrors[field.id] = `${fieldDef.label} is required`;
// //       }
// //       // Validate email format
// //       if (fieldDef.id === "email" && formValues[field.id]) {
// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //         if (!emailRegex.test(formValues[field.id])) {
// //           newErrors[field.id] = "Invalid email format";
// //         }
// //       }
// //       // Validate phone format
// //       if (fieldDef.id === "phone" && formValues[field.id]) {
// //         const phoneRegex = /^\d{10}$/;
// //         if (!phoneRegex.test(formValues[field.id])) {
// //           newErrors[field.id] = "Phone number must be 10 digits";
// //         }
// //       }
// //       // Validate number fields
// //       if (fieldDef.type === "number" && formValues[field.id]) {
// //         if (isNaN(formValues[field.id])) {
// //           newErrors[field.id] = `${fieldDef.label} must be a number`;
// //         } else if (fieldDef.min !== undefined && Number(formValues[field.id]) < fieldDef.min) {
// //           newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
// //         } else if (fieldDef.max !== undefined && Number(formValues[field.id]) > fieldDef.max) {
// //           newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
// //         }
// //       }
// //     });
// //     setErrors(newErrors);
// //     console.log("Validation errors:", newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!validateForm()) {
// //       return;
// //     }
// //     try {
// //       setLoading(true);
// //       setSubmitError(null);

// //       // Check for existing enquiry by email or phone
// //       const email = formValues.email?.trim().toLowerCase();
// //       const phone = formValues.phone?.trim();
// //       let existing = null;

// //       const enquiriesRef = collection(db, "enquiries");
// //       const queries = [];
// //       if (email) {
// //         queries.push(query(enquiriesRef, where("email", "==", email)));
// //       }
// //       if (phone) {
// //         queries.push(query(enquiriesRef, where("phone", "==", phone)));
// //       }

// //       if (queries.length > 0) {
// //         const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
// //         for (const snapshot of snapshots) {
// //           if (!snapshot.empty) {
// //             existing = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
// //             setExistingEnquiry(existing);
// //             setShowPrompt(true);
// //             setLoading(false);
// //             return;
// //           }
// //         }
// //       }

// //       // If no existing enquiry, proceed to create a new one
// //       await createNewEnquiry();
// //     } catch (err) {
// //       console.error("Submission error:", err);
// //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// //       setLoading(false);
// //     }
// //   };

// //   const createNewEnquiry = async () => {
// //     try {
// //       setLoading(true);
// //       setSubmitError(null);

// //       const enquiryData = {
// //         formId,
// //         ...formValues,
// //         stage: "pre-qualified",
// //         createdAt: serverTimestamp(),
// //         updatedAt: serverTimestamp(),
// //         tags: formData.tags || [],
// //       };

// //       const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
// //       console.log(`Created new enquiry with ID: ${newDocRef.id}`);
      
// //       // Update enquiry count
// //       const formRef = doc(db, "enquiryForms", formId);
// //       await updateDoc(formRef, {
// //         enquiryCount: increment(1),
// //       });

// //       setSubmitted({ success: true, isUpdate: false });

// //       setFormValues(
// //         formData.fields.reduce((acc, field) => {
// //           acc[field.id] = field.defaultValue || "";
// //           return acc;
// //         }, {})
// //       );
// //     } catch (err) {
// //       console.error("Submission error:", err);
// //       setSubmitError(`Error submitting enquiry: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handlePromptResponse = async (keepPrevious) => {
// //     setShowPrompt(false);
// //     try {
// //       setLoading(true);
// //       setSubmitError(null);

// //       if (keepPrevious) {
// //         // Keep the previous enquiry, do not create a new one
// //         setSubmitted({ success: true, isUpdate: true });
// //         console.log(`Kept existing enquiry with ID: ${existingEnquiry.id}`);
// //         setFormValues(
// //           formData.fields.reduce((acc, field) => {
// //             acc[field.id] = field.defaultValue || "";
// //             return acc;
// //           }, {})
// //         );
// //       } else {
// //         // Delete the existing enquiry
// //         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
// //         await deleteDoc(enquiryRef);
// //         console.log(`Deleted existing enquiry with ID: ${existingEnquiry.id}`);

// //         // Create a new enquiry
// //         await createNewEnquiry();
// //       }
// //     } catch (err) {
// //       console.error("Error handling prompt response:", err);
// //       setSubmitError(`Error processing enquiry: ${err.message}`);
// //     } finally {
// //       setLoading(false);
// //       setExistingEnquiry(null);
// //     }
// //   };

// //   if (submitError) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// //           <h2 className="text-xl font-semibold text-red-600">{submitError}</h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!formData) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// //           <h2 className="text-xl font-semibold">Loading...</h2>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (submitted.success) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
// //           <h2 className="text-xl font-semibold text-green-600">
// //             {submitted.isUpdate
// //               ? "Existing Enquiry Retained!"
// //               : "Enquiry Submitted Successfully!"}
// //           </h2>
// //           <p className="mt-2 text-gray-600">
// //             {submitted.isUpdate
// //               ? "The previous enquiry was retained as per your choice."
// //               : "Thank you for your submission."}
// //           </p>
// //           <Button
// //             color="blue"
// //             className="mt-4"
// //             onClick={() => {
// //               setSubmitted({ success: false, isUpdate: false });
// //               setFormValues(
// //                 formData.fields.reduce((acc, field) => {
// //                   acc[field.id] = field.defaultValue || "";
// //                   return acc;
// //                 }, {})
// //               );
// //             }}
// //           >
// //             Submit Another
// //           </Button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
// //       <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl w-full">
// //         <h2 className="text-2xl font-semibold text-gray-800 mb-6">{formData.name}</h2>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           {formData.fields.map((field) => {
// //             const fieldDef = flatFields.find((f) => f.id === field.id);
// //             if (!fieldDef) {
// //               console.warn(`Field definition not found for ID: ${field.id}`);
// //               return null;
// //             }

// //             const isError = !!errors[field.id];
// //             const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
// //             console.log(`Rendering field ${field.id}:`, {
// //               defaultValue: field.defaultValue,
// //               isDisabled,
// //               value: formValues[field.id],
// //             });

// //             return (
// //               <div key={field.id}>
// //                 {fieldDef.type === "textarea" ? (
// // <<<<<<< HEAD
// //                   <div>
// //                     <label
// //                       htmlFor={field.id}
// //                       className="block text-gray-700 text-sm font-medium mb-2"
// //                     >
// //                       {fieldDef.label}
// //                       {fieldDef.required && <span className="text-red-500">*</span>}
// //                     </label>
// //                     <textarea
// //                       id={field.id}
// //                       value={formValues[field.id] || ""}
// //                       onChange={(e) => handleChange(field.id, e.target.value)}
// //                       className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// //                         }`}
// //                       rows={4}
// //                       disabled={loading || isDisabled}
// //                     />
// //                   </div>
// //                 ) : fieldDef.type === "select" ? (
// //                   <FormControl fullWidth error={isError}>
// //                     <InputLabel>{fieldDef.label}</InputLabel>
// //                     <Select
// //                       id={field.id}
// //                       value={formValues[field.id] || ""}
// //                       onChange={(e) => handleChange(field.id, e.target.value)}
// //                       label={fieldDef.label}
// //                       disabled={loading || isDisabled}
// //                       className={isDisabled ? "bg-gray-100" : ""}
// //                     >
// //                       <MenuItem value="">
// //                         <em>Select {fieldDef.label}</em>
// //                       </MenuItem>
// //                       {fieldDef.options?.map((option) => (
// //                         <MenuItem key={option} value={option}>
// //                           {option}
// // =======
// //                   fieldDef.defaultValue === "" ?
// //                     (<div>
// //                       <label
// //                         htmlFor={field.id}
// //                         className="block text-gray-700 text-sm font-medium mb-2"
// //                       >
// //                         {fieldDef.label}
// //                         {fieldDef.required && <span className="text-red-500">*</span>}
// //                       </label>
// //                       <textarea
// //                         id={field.id}
// //                         value={formValues[field.id] || ""}
// //                         onChange={(e) => handleChange(field.id, e.target.value)}
// //                         className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// //                           } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// //                           }`}
// //                         rows={4}
// //                         disabled={loading || isDisabled}
// //                       />
// //                     </div>) :
// //                     (<div>
// //                       <label
// //                         htmlFor={field.id}
// //                         className="block text-gray-700 text-sm font-medium mb-2"
// //                       >
// //                         {fieldDef.label}
// //                         {fieldDef.required && <span className="text-red-500">*</span>}
// //                       </label>
// //                       <textarea
// //                         id={field.id}
// //                         value={formValues[field.id] || ""}
// //                         readOnly
// //                         className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// //                           } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
// //                         rows={4}
// //                         disabled={loading}
// //                       />
// //                     </div>)
// //                 )
// //                   : fieldDef.type === "select" ? (
// //                     <FormControl fullWidth error={isError}>
// //                       <InputLabel>{fieldDef.label}</InputLabel>
// //                       <Select
// //                         id={field.id}
// //                         value={formValues[field.id] || ""}
// //                         onChange={(e) => handleChange(field.id, e.target.value)}
// //                         label={fieldDef.label}
// //                         disabled={loading || isDisabled}
// //                         className={isDisabled ? "bg-gray-100" : ""}
// //                       >
// //                         <MenuItem value="">
// //                           <em>Select {fieldDef.label}</em>
// // >>>>>>> 4b9b98b3a6a279c50834edeb8cd5ba36427328d7
// //                         </MenuItem>
// //                       ))}
// //                     </Select>
// //                   </FormControl>
// //                 ) : (
// //                   <div>
// //                     <label
// //                       htmlFor={field.id}
// //                       className="block text-gray-700 text-sm font-medium mb-2"
// //                     >
// //                       {fieldDef.label}
// //                       {fieldDef.required && <span className="text-red-500">*</span>}
// //                     </label>
// //                     <input
// //                       type={fieldDef.type}
// //                       id={field.id}
// //                       value={formValues[field.id] || ""}
// //                       onChange={(e) => handleChange(field.id, e.target.value)}
// //                       className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
// //                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
// //                         }`}
// //                       disabled={loading || isDisabled}
// //                     />
// //                   </div>
// //                 )}
// //                 {isError && (
// //                   <p className="mt-1 text-sm text-red-500">{errors[field.id]}</p>
// //                 )}
// //               </div>
// //             );
// //           })}
// //           {submitError && (
// //             <p className="text-sm text-red-500">{submitError}</p>
// //           )}
// //           <div className="flex justify-end">
// //             <Button
// //               type="submit"
// //               color="blue"
// //               disabled={loading}
// //               className={loading ? "opacity-50 cursor-not-allowed" : ""}
// //             >
// //               {loading ? "Submitting..." : "Submit"}
// //             </Button>
// //           </div>
// //         </form>

// //         {/* Prompt for existing email */}
// //         {showPrompt && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
// //             <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
// //               <h3 className="text-lg font-semibold mb-4">
// //                 Duplicate Email or Phone Detected
// //               </h3>
// //               <p className="text-gray-600 mb-4">
// //                 An enquiry with the {formValues.email ? "email" : "phone"} "{formValues.email || formValues.phone}" already exists. Do you want to keep the previous enquiry or replace it with this new one?
// //               </p>
// //               <div className="flex justify-end space-x-2">
// //                 <Button
// //                   color="gray"
// //                   onClick={() => handlePromptResponse(true)}
// //                   disabled={loading}
// //                 >
// //                   Keep Previous
// //                 </Button>
// //                 <Button
// //                   color="blue"
// //                   onClick={() => handlePromptResponse(false)}
// //                   disabled={loading}
// //                 >
// //                   Use Latest
// //                 </Button>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SubmitEnquiryForm;


// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { db } from "../../../config/firebase";
// import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
// import { allEnquiryFields } from "./enquiryFields.jsx";
// import { Button } from "@material-tailwind/react";
// import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

// const SubmitEnquiryForm = () => {
//   const { formId } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });
//   const [existingEnquiry, setExistingEnquiry] = useState(null);
//   const [showPrompt, setShowPrompt] = useState(false);

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         const formRef = doc(db, "enquiryForms", formId);
//         const formSnap = await getDoc(formRef);
//         if (formSnap.exists()) {
//           const data = formSnap.data();
//           console.log("Fetched form data:", data);
//           setFormData(data);
//           // Initialize form values with default values
//           const initialValues = {};
//           data.fields.forEach((field) => {
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
//     if (errors[fieldId]) {
//       setErrors((prev) => ({ ...prev, [fieldId]: null }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     const flatFields = allEnquiryFields.flatMap((category) => category.fields);
//     formData.fields.forEach((field) => {
//       const fieldDef = flatFields.find((f) => f.id === field.id);
//       if (!fieldDef) return;

//       // Skip validation for disabled fields (non-empty defaultValue)
//       const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
//       if (isDisabled) return;

//       // Validate required fields
//       if (fieldDef.required && !formValues[field.id]?.trim()) {
//         newErrors[field.id] = `${fieldDef.label} is required`;
//       }
//       // Validate email format
//       if (fieldDef.id === "email" && formValues[field.id]) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formValues[field.id])) {
//           newErrors[field.id] = "Invalid email format";
//         }
//       }
//       // Validate phone format
//       if (fieldDef.id === "phone" && formValues[field.id]) {
//         const phoneRegex = /^\d{10}$/;
//         if (!phoneRegex.test(formValues[field.id])) {
//           newErrors[field.id] = "Phone number must be 10 digits";
//         }
//       }
//       // Validate number fields
//       if (fieldDef.type === "number" && formValues[field.id]) {
//         if (isNaN(formValues[field.id])) {
//           newErrors[field.id] = `${fieldDef.label} must be a number`;
//         } else if (fieldDef.min !== undefined && Number(formValues[field.id]) < fieldDef.min) {
//           newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
//         } else if (fieldDef.max !== undefined && Number(formValues[field.id]) > fieldDef.max) {
//           newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
//         }
//       }
//     });
//     setErrors(newErrors);
//     console.log("Validation errors:", newErrors);
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

//       // Check for existing enquiry by email or phone
//       const email = formValues.email?.trim().toLowerCase();
//       const phone = formValues.phone?.trim();
//       let existing = null;

//       const enquiriesRef = collection(db, "enquiries");
//       const queries = [];
//       if (email) {
//         queries.push(query(enquiriesRef, where("email", "==", email)));
//       }
//       if (phone) {
//         queries.push(query(enquiriesRef, where("phone", "==", phone)));
//       }

//       if (queries.length > 0) {
//         const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
//         for (const snapshot of snapshots) {
//           if (!snapshot.empty) {
//             existing = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
//             setExistingEnquiry(existing);
//             setShowPrompt(true);
//             setLoading(false);
//             return;
//           }
//         }
//       }

//       // If no existing enquiry, proceed to create a new one
//       await createNewEnquiry();
//     } catch (err) {
//       console.error("Submission error:", err);
//       setSubmitError(`Error submitting enquiry: ${err.message}`);
//       setLoading(false);
//     }
//   };

//   const createNewEnquiry = async () => {
//     try {
//       setLoading(true);
//       setSubmitError(null);

//       const enquiryData = {
//         formId,
//         ...formValues,
//         stage: "pre-qualified",
//         createdAt: serverTimestamp(),
//         updatedAt: serverTimestamp(),
//         tags: formData.tags || [],
//       };

//       const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
//       console.log(`Created new enquiry with ID: ${newDocRef.id}`);
      
//       // Update enquiry count
//       const formRef = doc(db, "enquiryForms", formId);
//       await updateDoc(formRef, {
//         enquiryCount: increment(1),
//       });

//       setSubmitted({ success: true, isUpdate: false });

//       setFormValues(
//         formData.fields.reduce((acc, field) => {
//           acc[field.id] = field.defaultValue || "";
//           return acc;
//         }, {})
//       );
//     } catch (err) {
//       console.error("Submission error:", err);
//       setSubmitError(`Error submitting enquiry: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePromptResponse = async (keepPrevious) => {
//     setShowPrompt(false);
//     try {
//       setLoading(true);
//       setSubmitError(null);

//       if (keepPrevious) {
//         // Keep the previous enquiry, do not create a new one
//         setSubmitted({ success: true, isUpdate: true });
//         console.log(`Kept existing enquiry with ID: ${existingEnquiry.id}`);
//         setFormValues(
//           formData.fields.reduce((acc, field) => {
//             acc[field.id] = field.defaultValue || "";
//             return acc;
//           }, {})
//         );
//       } else {
//         // Delete the existing enquiry
//         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
//         await deleteDoc(enquiryRef);
//         console.log(`Deleted existing enquiry with ID: ${existingEnquiry.id}`);

//         // Create a new enquiry
//         await createNewEnquiry();
//       }
//     } catch (err) {
//       console.error("Error handling prompt response:", err);
//       setSubmitError(`Error processing enquiry: ${err.message}`);
//     } finally {
//       setLoading(false);
//       setExistingEnquiry(null);
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

//   if (submitted.success) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
//           <h2 className="text-xl font-semibold text-green-600">
//             {submitted.isUpdate
//               ? "Existing Enquiry Retained!"
//               : "Enquiry Submitted Successfully!"}
//           </h2>
//           <p className="mt-2 text-gray-600">
//             {submitted.isUpdate
//               ? "The previous enquiry was retained as per your choice."
//               : "Thank you for your submission."}
//           </p>
//           <Button
//             color="blue"
//             className="mt-4"
//             onClick={() => {
//               setSubmitted({ success: false, isUpdate: false });
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
//             if (!fieldDef) {
//               console.warn(`Field definition not found for ID: ${field.id}`);
//               return null;
//             }

//             const isError = !!errors[field.id];
//             const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
//             console.log(`Rendering field ${field.id}:`, {
//               defaultValue: field.defaultValue,
//               isDisabled,
//               value: formValues[field.id],
//             });

//             return (
//               <div key={field.id}>
//                 {fieldDef.type === "textarea" ? (
//                   <div>
//                     <label
//                       htmlFor={field.id}
//                       className="block text-gray-700 text-sm font-medium mb-2"
//                     >
//                       {fieldDef.label}
//                       {fieldDef.required && <span className="text-red-500">*</span>}
//                     </label>
//                     <textarea
//                       id={field.id}
//                       value={formValues[field.id] || ""}
//                       onChange={(e) => handleChange(field.id, e.target.value)}
//                       className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
//                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//                         }`}
//                       rows={4}
//                       disabled={loading || isDisabled}
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
//                       disabled={loading || isDisabled}
//                       className={isDisabled ? "bg-gray-100" : ""}
//                     >
//                       <MenuItem value="">
//                         <em>Select {fieldDef.label}</em>
//                       </MenuItem>
//                       {fieldDef.options?.map((option) => (
//                         <MenuItem key={option} value={option}>
//                           {option}
//                         </MenuItem>
//                       ))}
//                     </Select>
//                   </FormControl>
//                 ) : (
//                   <div>
//                     <label
//                       htmlFor={field.id}
//                       className="block text-gray-700 text-sm font-medium mb-2"
//                     >
//                       {fieldDef.label}
//                       {fieldDef.required && <span className="text-red-500">*</span>}
//                     </label>
//                     <input
//                       type={fieldDef.type}
//                       id={field.id}
//                       value={formValues[field.id] || ""}
//                       onChange={(e) => handleChange(field.id, e.target.value)}
//                       className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
//                         } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
//                         }`}
//                       disabled={loading || isDisabled}
//                     />
//                   </div>
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

//         {/* Prompt for existing email */}
//         {showPrompt && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
//             <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
//               <h3 className="text-lg font-semibold mb-4">
//                 Duplicate Email or Phone Detected
//               </h3>
//               <p className="text-gray-600 mb-4">
//                 An enquiry with the {formValues.email ? "email" : "phone"} "{formValues.email || formValues.phone}" already exists. Do you want to keep the previous enquiry or replace it with this new one?
//               </p>
//               <div className="flex justify-end space-x-2">
//                 <Button
//                   color="gray"
//                   onClick={() => handlePromptResponse(true)}
//                   disabled={loading}
//                 >
//                   Keep Previous
//                 </Button>
//                 <Button
//                   color="blue"
//                   onClick={() => handlePromptResponse(false)}
//                   disabled={loading}
//                 >
//                   Use Latest
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SubmitEnquiryForm;




import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../config/firebase";
import { doc, getDoc, addDoc, updateDoc, collection, query, where, getDocs, serverTimestamp, deleteDoc } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";
import { Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const SubmitEnquiryForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState({ success: false, isUpdate: false });
  const [existingEnquiry, setExistingEnquiry] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const formRef = doc(db, "enquiryForms", formId);
        const formSnap = await getDoc(formRef);
        if (formSnap.exists()) {
          const data = formSnap.data();
          console.log("Fetched form data:", data);
          setFormData(data);
          // Initialize form values with default values
          const initialValues = {};
          data.fields.forEach((field) => {
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
      if (!fieldDef) return;
      const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
      if (isDisabled) return;
  
      if (fieldDef.required && !formValues[field.id]?.trim()) {
        newErrors[field.id] = `${fieldDef.label} is required`;
      }
      if (fieldDef.id === "email" && formValues[field.id]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formValues[field.id])) {
          newErrors[field.id] = "Invalid email format";
        }
      }
      if (fieldDef.id === "phone" && formValues[field.id]) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formValues[field.id])) {
          newErrors[field.id] = "Phone number must be 10 digits";
        }
      }
      if (fieldDef.type === "number" && formValues[field.id]) {
        if (isNaN(formValues[field.id])) {
          newErrors[field.id] = `${fieldDef.label} must be a number`;
        } else {
          const value = Number(formValues[field.id]);
          if (fieldDef.min !== undefined && value < fieldDef.min) {
            newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
          } else if (fieldDef.max !== undefined && value > fieldDef.max) {
            newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
          } else if (["sscPercentage", "hscPercentage", "graduationPercentage", "postGraduationPercentage"].includes(fieldDef.id) && !/^\d{1,2}$/.test(formValues[field.id])) {
            newErrors[field.id] = `${fieldDef.label} must be a whole number between 0 and 100`;
          }
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const validateForm = () => {
  //   const newErrors = {};
  //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);
  //   formData.fields.forEach((field) => {
  //     const fieldDef = flatFields.find((f) => f.id === field.id);
  //     if (!fieldDef) return;
  //     const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
  //     if (isDisabled) return;
  
  //     if (fieldDef.required && !formValues[field.id]?.trim()) {
  //       newErrors[field.id] = `${fieldDef.label} is required`;
  //     }
  //     if (fieldDef.id === "email" && formValues[field.id]) {
  //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //       if (!emailRegex.test(formValues[field.id])) {
  //         newErrors[field.id] = "Invalid email format";
  //       }
  //     }
  //     if (fieldDef.id === "phone" && formValues[field.id]) {
  //       const phoneRegex = /^\d{10}$/;
  //       if (!phoneRegex.test(formValues[field.id])) {
  //         newErrors[field.id] = "Phone number must be 10 digits";
  //       }
  //     }
  //     if (fieldDef.type === "number" && formValues[field.id]) {
  //       if (isNaN(formValues[field.id])) {
  //         newErrors[field.id] = `${fieldDef.label} must be a number`;
  //       } else {
  //         const value = Number(formValues[field.id]);
  //         if (fieldDef.min !== undefined && value < fieldDef.min) {
  //           newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
  //         } else if (fieldDef.max !== undefined && value > fieldDef.max) {
  //           newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
  //         } else if (["sscPassOutYear", "hscPassOutYear", "graduationPassOutYear", "postGraduationPassOutYear"].includes(fieldDef.id) && !/^\d{4}$/.test(formValues[field.id])) {
  //           newErrors[field.id] = `${fieldDef.label} must be a 4-digit year`;
  //         }
  //       }
  //     }
  //   });
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // const validateForm = () => {
  //   const newErrors = {};
  //   const flatFields = allEnquiryFields.flatMap((category) => category.fields);
  //   formData.fields.forEach((field) => {
  //     const fieldDef = flatFields.find((f) => f.id === field.id);
  //     if (!fieldDef) return;

  //     // Skip validation for disabled fields (non-empty defaultValue)
  //     const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
  //     if (isDisabled) return;

  //     // Validate required fields
  //     if (fieldDef.required && !formValues[field.id]?.trim()) {
  //       newErrors[field.id] = `${fieldDef.label} is required`;
  //     }
  //     // Validate email format
  //     if (fieldDef.id === "email" && formValues[field.id]) {
  //       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //       if (!emailRegex.test(formValues[field.id])) {
  //         newErrors[field.id] = "Invalid email format";
  //       }
  //     }
  //     // Validate phone format
  //     if (fieldDef.id === "phone" && formValues[field.id]) {
  //       const phoneRegex = /^\d{10}$/;
  //       if (!phoneRegex.test(formValues[field.id])) {
  //         newErrors[field.id] = "Phone number must be 10 digits";
  //       }
  //     }
  //     // Validate number fields
  //     if (fieldDef.type === "number" && formValues[field.id]) {
  //       if (isNaN(formValues[field.id])) {
  //         newErrors[field.id] = `${fieldDef.label} must be a number`;
  //       } else if (fieldDef.min !== undefined && Number(formValues[field.id]) < fieldDef.min) {
  //         newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
  //       } else if (fieldDef.max !== undefined && Number(formValues[field.id]) > fieldDef.max) {
  //         newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
  //       }
  //     }
  //     // if (fieldDef.type === "number" && formValues[field.id]) {
  //     //   if (isNaN(formValues[field.id])) {
  //     //     newErrors[field.id] = `${fieldDef.label} must be a number`;
  //     //   } else if (fieldDef.min !== undefined && Number(formValues[field.id]) < fieldDef.min) {
  //     //     newErrors[field.id] = `${fieldDef.label} must be at least ${fieldDef.min}`;
  //     //   } else if (fieldDef.max !== undefined && Number(formValues[field.id]) > fieldDef.max) {
  //     //     newErrors[field.id] = `${fieldDef.label} cannot exceed ${fieldDef.max}`;
  //     //   }
  //     // }
  //   });
  //   setErrors(newErrors);
  //   console.log("Validation errors:", newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      setSubmitError(null);

      // Check for existing enquiry by email or phone
      const email = formValues.email?.trim().toLowerCase();
      const phone = formValues.phone?.trim();
      let existing = null;
      

      const enquiriesRef = collection(db, "enquiries");
      const queries = [];
      if (email) {
        queries.push(query(enquiriesRef, where("email", "==", email)));
      }
      if (phone) {
        queries.push(query(enquiriesRef, where("phone", "==", phone)));
      }

      if (queries.length > 0) {
        const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
        for (const snapshot of snapshots) {
          if (!snapshot.empty) {
            existing = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            setExistingEnquiry(existing);
            setShowPrompt(true);
            setLoading(false);
            return;
          }
        }
      }

      if (!keepPrevious) {
        await deleteDoc(doc(db, "enquiries", existingEnquiry.id));
        await createNewEnquiry();
      }

      // if (queries.length > 0) {
      //   const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
      //   for (const snapshot of snapshots) {
      //     if (!snapshot.empty) {
      //       existing = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
      //       setExistingEnquiry(existing);
      //       setShowPrompt(true);
      //       setLoading(false);
      //       return;
      //     }
      //   }
      // }

      // If no existing enquiry, proceed to create a new one
      await createNewEnquiry();
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(`Error submitting enquiry: ${err.message}`);
      setLoading(false);
    }
  };

  const createNewEnquiry = async () => {
    try {
      setLoading(true);
      setSubmitError(null);
      const assignedUser = formData.users?.[0] || formData.roles?.[0] || "Form Submission";
  
      const enquiryData = {
        formId,
        ...formValues,
        stage: "pre-qualified",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastModifiedTime: serverTimestamp(),
        lastTouched: serverTimestamp(),
        createdBy: assignedUser,
        owner: assignedUser,
        assignedTo: assignedUser,
        tags: formData.tags || [],
        history: [
          {
            action: `Enquiry created via form "${formData.name}" (ID: ${formId})`,
            performedBy: assignedUser,
            timestamp: serverTimestamp(),
            formName: formData.name,
          },
        ],
      };
  
      const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
      await updateDoc(doc(db, "enquiryForms", formId), {
        enquiryCount: increment(1),
      });
      setSubmitted({ success: true, isUpdate: false });
      resetForm();
    } catch (err) {
      setSubmitError(`Error submitting enquiry: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // const createNewEnquiry = async () => {
  //   try {
  //     setLoading(true);
  //     setSubmitError(null);
  
  //     // Determine assigned user/role
  //     const assignedUser = formData.users?.[0] || formData.roles?.[0] || "Form Submission";
  
  //     const enquiryData = {
  //       formId,
  //       ...formValues,
  //       stage: "pre-qualified",
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp(),
  //       lastModifiedTime: serverTimestamp(),
  //       lastTouched: serverTimestamp(),
  //       createdBy: assignedUser,
  //       owner: assignedUser,
  //       assignedTo: assignedUser,
  //       tags: formData.tags || [],
  //       history: [
  //         {
  //           action: `Enquiry created via form ${formId}`,
  //           performedBy: "Form Submission",
  //           timestamp: serverTimestamp(),
  //         },
  //       ]
  //       // history: [
  //       //   {
  //       //     action: `Enquiry created via form ${formId}`,
  //       //     performedBy: assignedUser,
  //       //     timestamp: serverTimestamp(),
  //       //   },
  //       // ],
  //     };
  
  //     const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //     console.log(`Created new enquiry with ID: ${newDocRef.id}`);
      
  //     await updateDoc(doc(db, "enquiryForms", formId), {
  //       enquiryCount: increment(1),
  //     });
  
  //     setSubmitted({ success: true, isUpdate: false });
  //     resetForm();
  //   } catch (err) {
  //     setSubmitError(`Error submitting enquiry: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const enrichedFields = fields.map((field) => {
    const fieldConfig = allEnquiryFields
      .flatMap((category) => category.fields)
      .find((f) => f.id === field.id);
    return {
      ...field,
      name: field.id,
      type: fieldConfig?.type || "text",
      label: fieldConfig?.label || field.id,
      options: field.options || fieldConfig?.options || [], // Prioritize stored options
      required: fieldConfig?.required || false,
    };
  });

  // const enrichedFields = fields.map((field) => {
  //   const fieldConfig = allEnquiryFields
  //     .flatMap((category) => category.fields)
  //     .find((f) => f.id === field.id);
  //   return {
  //     ...field,
  //     name: field.id,
  //     type: fieldConfig?.type || "text",
  //     label: fieldConfig?.label || field.id,
  //     options: fieldConfig?.options || [],
  //     required: fieldConfig?.required || false,
  //   };
  // });
  
  const handlePromptResponse = async (keepPrevious) => {
    setShowPrompt(false);
    try {
      setLoading(true);
      setSubmitError(null);
      const assignedUser = formData.users?.[0] || formData.roles?.[0] || "Form Submission";
  
      if (keepPrevious) {
        setSubmitted({ success: true, isUpdate: true });
        resetForm();
      } else {
        await deleteDoc(doc(db, "enquiries", existingEnquiry.id));
        const enquiryData = {
          formId,
          ...formValues,
          stage: "pre-qualified",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastModifiedTime: serverTimestamp(),
          lastTouched: serverTimestamp(),
          createdBy: assignedUser,
          owner: assignedUser,
          assignedTo: assignedUser,
          tags: formData.tags || [],
          history: [
            {
              action: `Enquiry created via form ${formId} after deleting duplicate`,
              performedBy: assignedUser,
              timestamp: serverTimestamp(),
            },
          ],
        };
        const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
        await updateDoc(doc(db, "enquiryForms", formId), {
          enquiryCount: increment(1),
        });
        setSubmitted({ success: true, isUpdate: false });
        resetForm();
      }
    } catch (err) {
      setSubmitError(`Error processing enquiry: ${err.message}`);
    } finally {
      setLoading(false);
      setExistingEnquiry(null);
    }
  };
  
  const resetForm = () => {
    setFormValues(
      formData.fields.reduce((acc, field) => {
        acc[field.id] = field.defaultValue || "";
        return acc;
      }, {})
    );
  };

  // const createNewEnquiry = async () => {
  //   try {
  //     setLoading(true);
  //     setSubmitError(null);

  //     const enquiryData = {
  //       formId,
  //       ...formValues,
  //       stage: "pre-qualified",
  //       createdAt: serverTimestamp(),
  //       updatedAt: serverTimestamp(),
  //       tags: formData.tags || [],
  //     };

  //     const newDocRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //     console.log(`Created new enquiry with ID: ${newDocRef.id}`);
      
  //     // Update enquiry count
  //     const formRef = doc(db, "enquiryForms", formId);
  //     await updateDoc(formRef, {
  //       enquiryCount: increment(1),
  //     });

  //     setSubmitted({ success: true, isUpdate: false });

  //     setFormValues(
  //       formData.fields.reduce((acc, field) => {
  //         acc[field.id] = field.defaultValue || "";
  //         return acc;
  //       }, {})
  //     );
  //   } catch (err) {
  //     console.error("Submission error:", err);
  //     setSubmitError(`Error submitting enquiry: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handlePromptResponse = async (keepPrevious) => {
  //   setShowPrompt(false);
  //   try {
  //     setLoading(true);
  //     setSubmitError(null);

  //     if (keepPrevious) {
  //       // Keep the previous enquiry, do not create a new one
  //       setSubmitted({ success: true, isUpdate: true });
  //       console.log(`Kept existing enquiry with ID: ${existingEnquiry.id}`);
  //       setFormValues(
  //         formData.fields.reduce((acc, field) => {
  //           acc[field.id] = field.defaultValue || "";
  //           return acc;
  //         }, {})
  //       );
  //     } else {
  //       // Delete the existing enquiry
  //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
  //       await deleteDoc(enquiryRef);
  //       console.log(`Deleted existing enquiry with ID: ${existingEnquiry.id}`);

  //       // Create a new enquiry
  //       await createNewEnquiry();
  //     }
  //   } catch (err) {
  //     console.error("Error handling prompt response:", err);
  //     setSubmitError(`Error processing enquiry: ${err.message}`);
  //   } finally {
  //     setLoading(false);
  //     setExistingEnquiry(null);
  //   }
  // };

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

  if (submitted.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg w-full">
          <h2 className="text-xl font-semibold text-green-600">
            {submitted.isUpdate
              ? "Existing Enquiry Retained!"
              : "Enquiry Submitted Successfully!"}
          </h2>
          <p className="mt-2 text-gray-600">
            {submitted.isUpdate
              ? "The previous enquiry was retained as per your choice."
              : "Thank you for your submission."}
          </p>
          <Button
            color="blue"
            className="mt-4"
            onClick={() => {
              setSubmitted({ success: false, isUpdate: false });
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
            if (!fieldDef) {
              console.warn(`Field definition not found for ID: ${field.id}`);
              return null;
            }

            const isError = !!errors[field.id];
            const isDisabled = field.defaultValue && field.defaultValue.trim() !== "";
            console.log(`Rendering field ${field.id}:`, {
              defaultValue: field.defaultValue,
              isDisabled,
              value: formValues[field.id],
            });

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
                      className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      rows={4}
                      disabled={loading || isDisabled}
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
                      disabled={loading || isDisabled}
                      className={isDisabled ? "bg-gray-100" : ""}
                    >
                      <MenuItem value="">
                        <em>Select {fieldDef.label}</em>
                      </MenuItem>
                      {fieldDef.options?.map((option) => (
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
  className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
  disabled={loading || isDisabled}
/>
                    {/* <input
                      type={fieldDef.type}
                      id={field.id}
                      value={formValues[field.id] || ""}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      disabled={loading || isDisabled}
                    /> */}
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

        {/* Prompt for existing email */}
        {showPrompt && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4">Duplicate Enquiry Detected</h3>
      <p className="text-gray-600 mb-4">
        An enquiry with the {formValues.email ? "email" : "phone"} "{formValues.email || formValues.phone}" already exists:
      </p>
      <div className="mb-4 p-4 bg-gray-100 rounded-md">
        <p><strong>Name:</strong> {existingEnquiry?.name || "N/A"}</p>
        <p><strong>Email:</strong> {existingEnquiry?.email || "N/A"}</p>
        <p><strong>Phone:</strong> {existingEnquiry?.phone || "N/A"}</p>
        <p><strong>Stage:</strong> {existingEnquiry?.stage || "N/A"}</p>
        <p><strong>Created At:</strong> {existingEnquiry?.createdAt || "N/A"}</p>
      </div>
      <p className="text-gray-600 mb-4">
        Do you want to keep the previous enquiry or replace it with this new one?
      </p>
      <div className="flex justify-end space-x-2">
        <Button
          color="gray"
          onClick={() => handlePromptResponse(true)}
          disabled={loading}
        >
          Keep Previous
        </Button>
        <Button
          color="blue"
          onClick={() => handlePromptResponse(false)}
          disabled={loading}
        >
          Use Latest
        </Button>
      </div>
    </div>
  </div>
)}
        {/* {showPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                Duplicate Email or Phone Detected
              </h3>
              <p className="text-gray-600 mb-4">
                An enquiry with the {formValues.email ? "email" : "phone"} "{formValues.email || formValues.phone}" already exists. Do you want to keep the previous enquiry or replace it with this new one?
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  color="gray"
                  onClick={() => handlePromptResponse(true)}
                  disabled={loading}
                >
                  Keep Previous
                </Button>
                <Button
                  color="blue"
                  onClick={() => handlePromptResponse(false)}
                  disabled={loading}
                >
                  Use Latest
                </Button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default SubmitEnquiryForm;