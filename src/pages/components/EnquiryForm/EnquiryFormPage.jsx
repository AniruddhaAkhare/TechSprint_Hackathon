

// // // // import { useParams } from 'react-router-dom';
// // // // import { useEffect, useState } from 'react';
// // // // import { db } from "../../../config/firebase";
// // // // import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';

// // // // const EnquiryFormPage = () => {
// // // //   const { id } = useParams();
// // // //   const [formFields, setFormFields] = useState([]);
// // // //   const [formData, setFormData] = useState({});
// // // //   const [formTitle, setFormTitle] = useState('');

// // // //   useEffect(() => {
// // // //     const fetchFormFields = async () => {
// // // //       const docRef = doc(db, 'EnquiryForms', id);
// // // //       const docSnap = await getDoc(docRef);
// // // //       if (docSnap.exists()) {
// // // //         const data = docSnap.data();
// // // //         setFormTitle(data.title || 'Enquiry Form');
// // // //         const fields = data.fields || [];
// // // //         setFormFields(fields);

// // // //         // Initialize formData with default values
// // // //         const initialFormData = {};
// // // //         fields.forEach((field) => {
// // // //           if (field.defaultValue) {
// // // //             initialFormData[field.name] = field.defaultValue;
// // // //           }
// // // //         });
// // // //         setFormData(initialFormData);
// // // //       }
// // // //     };
// // // //     fetchFormFields();
// // // //   }, [id]);

// // // //   const handleChange = (e, fieldName) => {
// // // //     setFormData({ ...formData, [fieldName]: e.target.value });
// // // //   };

// // // //   const handleSubmit = async (e) => {
// // // //     e.preventDefault();
// // // //     // Store the filled data in Enquiries collection
// // // //     await addDoc(collection(db, 'Enquiries'), {
// // // //       formId: id,
// // // //       ...formData,
// // // //       submittedAt: new Date(),
// // // //     });

// // // //     // Increment the enquiry count in EnquiryForms
// // // //     const formRef = doc(db, 'EnquiryForms', id);
// // // //     await updateDoc(formRef, {
// // // //       enquiryCount: increment(1),
// // // //     });

// // // //     alert('Enquiry submitted!');
// // // //   };

// // // //   return (
// // // //     <div className="p-4 max-w-xl mx-auto">
// // // //       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
// // // //       <form onSubmit={handleSubmit}>
// // // //         {formFields.map((field, index) => {
// // // //           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

// // // //           return (
// // // //             <div key={index} className="mb-4">
// // // //               <label className="block font-medium">{field.label}</label>
// // // //               {hasDefaultValue ? (
// // // //                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
// // // //                   {field.defaultValue}
// // // //                 </p>
// // // //               ) : (
// // // //                 <input
// // // //                   type={field.type || 'text'}
// // // //                   placeholder={field.placeholder}
// // // //                   value={formData[field.name] || ''}
// // // //                   onChange={(e) => handleChange(e, field.name)}
// // // //                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// // // //                   required={field.required}
// // // //                 />
// // // //               )}
// // // //             </div>
// // // //           );
// // // //         })}

// // // //         <button
// // // //           type="submit"
// // // //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// // // //         >
// // // //           Submit
// // // //         </button>
// // // //       </form>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default EnquiryFormPage;



// // // import { useParams } from 'react-router-dom';
// // // import { useEffect, useState } from 'react';
// // // import { db } from "../../../config/firebase";
// // // import { doc, getDoc, addDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

// // // const EnquiryFormPage = () => {
// // //   const { id } = useParams();
// // //   const [formFields, setFormFields] = useState([]);
// // //   const [formData, setFormData] = useState({});
// // //   const [formTitle, setFormTitle] = useState('');
// // //   const [error, setError] = useState(null);

// // //   useEffect(() => {
// // //     const fetchFormFields = async () => {
// // //       try {
// // //         const docRef = doc(db, 'EnquiryForms', id);
// // //         const docSnap = await getDoc(docRef);
// // //         if (docSnap.exists()) {
// // //           const data = docSnap.data();
// // //           setFormTitle(data.title || 'Enquiry Form');
// // //           const fields = data.fields || [];
// // //           setFormFields(fields);

// // //           // Initialize formData with default values
// // //           const initialFormData = {};
// // //           fields.forEach((field) => {
// // //             if (field.defaultValue) {
// // //               initialFormData[field.name] = field.defaultValue;
// // //             }
// // //           });
// // //           setFormData(initialFormData);
// // //         } else {
// // //           setError('Form not found');
// // //         }
// // //       } catch (err) {
// // //         setError(`Error fetching form: ${err.message}`);
// // //       }
// // //     };
// // //     fetchFormFields();
// // //   }, [id]);

// // //   const handleChange = (e, fieldName) => {
// // //     setFormData({ ...formData, [fieldName]: e.target.value });
// // //   };

// // //   const validateForm = () => {
// // //     const errors = {};
// // //     formFields.forEach((field) => {
// // //       if (field.required && !formData[field.name]?.trim()) {
// // //         errors[field.name] = `${field.label} is required`;
// // //       }
// // //       if (field.name === 'email' && formData[field.name]) {
// // //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //         if (!emailRegex.test(formData[field.name])) {
// // //           errors[field.name] = 'Invalid email format';
// // //         }
// // //       }
// // //     });
// // //     return errors;
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();

// // //     // Validate form
// // //     const errors = validateForm();
// // //     if (Object.keys(errors).length > 0) {
// // //       setError(Object.values(errors)[0]); // Display first error
// // //       return;
// // //     }

// // //     try {
// // //       setError(null);

// // //       // Prepare enquiry data
// // //       const enquiryData = {
// // //         formId: id,
// // //         ...formData,
// // //         submittedAt: new Date(),
// // //       };

// // //       // Normalize email for matching
// // //       const email = formData.email?.trim().toLowerCase();
// // //       let existingEnquiry = null;

// // //       if (email) {
// // //         // Check for existing enquiry by email
// // //         const enquiriesRef = collection(db, 'Enquiries');
// // //         const emailQuery = query(enquiriesRef, where('email', '==', email));
// // //         const emailSnapshot = await getDocs(emailQuery);
// // //         if (!emailSnapshot.empty) {
// // //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// // //         }
// // //       }

// // //       // Increment the enquiry count in EnquiryForms
// // //       const formRef = doc(db, 'EnquiryForms', id);

// // //       if (existingEnquiry) {
// // //         // Replace existing enquiry, preserving createdAt
// // //         const enquiryRef = doc(db, 'Enquiries', existingEnquiry.id);
// // //         const updatedData = {
// // //           ...enquiryData,
// // //           createdAt: existingEnquiry.createdAt || new Date(),
// // //         };
// // //         await updateDoc(enquiryRef, updatedData);
// // //         console.log(`Replaced existing enquiry with ID: ${existingEnquiry.id}`);
// // //       } else {
// // //         // Create new enquiry
// // //         await addDoc(collection(db, 'Enquiries'), enquiryData);
// // //         console.log('Created new enquiry');
// // //       }

// // //       // Update enquiry count
// // //       await updateDoc(formRef, {
// // //         enquiryCount: increment(1),
// // //       });

// // //       alert('Enquiry submitted successfully!');
// // //       // Reset form
// // //       const initialFormData = {};
// // //       formFields.forEach((field) => {
// // //         if (field.defaultValue) {
// // //           initialFormData[field.name] = field.defaultValue;
// // //         }
// // //       });
// // //       setFormData(initialFormData);
// // //     } catch (err) {
// // //       console.error('Error submitting enquiry:', err);
// // //       setError(`Error submitting enquiry: ${err.message}`);
// // //     }
// // //   };

// // //   if (error) {
// // //     return (
// // //       <div className="p-4 max-w-xl mx-auto">
// // //         <h2 className="text-2xl font-bold text-red-600">{error}</h2>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="p-4 max-w-xl mx-auto">
// // //       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
// // //       <form onSubmit={handleSubmit}>
// // //         {formFields.map((field, index) => {
// // //           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== '';

// // //           return (
// // //             <div key={index} className="mb-4">
// // //               <label className="block font-medium">
// // //                 {field.label}
// // //                 {field.required && <span className="text-red-500">*</span>}
// // //               </label>
// // //               {hasDefaultValue ? (
// // //                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
// // //                   {field.defaultValue}
// // //                 </p>
// // //               ) : (
// // //                 <input
// // //                   type={field.type || 'text'}
// // //                   placeholder={field.placeholder}
// // //                   value={formData[field.name] || ''}
// // //                   onChange={(e) => handleChange(e, field.name)}
// // //                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   required={field.required}
// // //                 />
// // //               )}
// // //             </div>
// // //           );
// // //         })}
// // //         {error && <p className="text-red-500 mb-4">{error}</p>}
// // //         <button
// // //           type="submit"
// // //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// // //         >
// // //           Submit
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default EnquiryFormPage;




// // // import { useParams } from 'react-router-dom';
// // // import { useEffect, useState } from 'react';
// // // import { db } from "../../../config/firebase";
// // // import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';

// // // const EnquiryFormPage = () => {
// // //   const { id } = useParams();
// // //   const [formFields, setFormFields] = useState([]);
// // //   const [formData, setFormData] = useState({});
// // //   const [formTitle, setFormTitle] = useState('');

// // //   useEffect(() => {
// // //     const fetchFormFields = async () => {
// // //       const docRef = doc(db, 'EnquiryForms', id);
// // //       const docSnap = await getDoc(docRef);
// // //       if (docSnap.exists()) {
// // //         const data = docSnap.data();
// // //         setFormTitle(data.title || 'Enquiry Form');
// // //         const fields = data.fields || [];
// // //         setFormFields(fields);

// // //         // Initialize formData with default values
// // //         const initialFormData = {};
// // //         fields.forEach((field) => {
// // //           if (field.defaultValue) {
// // //             initialFormData[field.name] = field.defaultValue;
// // //           }
// // //         });
// // //         setFormData(initialFormData);
// // //       }
// // //     };
// // //     fetchFormFields();
// // //   }, [id]);

// // //   const handleChange = (e, fieldName) => {
// // //     setFormData({ ...formData, [fieldName]: e.target.value });
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     // Store the filled data in Enquiries collection
// // //     await addDoc(collection(db, 'Enquiries'), {
// // //       formId: id,
// // //       ...formData,
// // //       submittedAt: new Date(),
// // //     });

// // //     // Increment the enquiry count in EnquiryForms
// // //     const formRef = doc(db, 'EnquiryForms', id);
// // //     await updateDoc(formRef, {
// // //       enquiryCount: increment(1),
// // //     });

// // //     alert('Enquiry submitted!');
// // //   };

// // //   return (
// // //     <div className="p-4 max-w-xl mx-auto">
// // //       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
// // //       <form onSubmit={handleSubmit}>
// // //         {formFields.map((field, index) => {
// // //           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

// // //           return (
// // //             <div key={index} className="mb-4">
// // //               <label className="block font-medium">{field.label}</label>
// // //               {hasDefaultValue ? (
// // //                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
// // //                   {field.defaultValue}
// // //                 </p>
// // //               ) : (
// // //                 <input
// // //                   type={field.type || 'text'}
// // //                   placeholder={field.placeholder}
// // //                   value={formData[field.name] || ''}
// // //                   onChange={(e) => handleChange(e, field.name)}
// // //                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                   required={field.required}
// // //                 />
// // //               )}
// // //             </div>
// // //           );
// // //         })}

// // //         <button
// // //           type="submit"
// // //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// // //         >
// // //           Submit
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // };

// // // export default EnquiryFormPage;



// // import { useParams } from 'react-router-dom';
// // import { useEffect, useState } from 'react';
// // import { db } from "../../../config/firebase";
// // import { doc, getDoc, addDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

// // const EnquiryFormPage = () => {
// //   const { id } = useParams();
// //   const [formFields, setFormFields] = useState([]);
// //   const [formData, setFormData] = useState({});
// //   const [formTitle, setFormTitle] = useState('');
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchFormFields = async () => {
// //       try {
// //         const docRef = doc(db, 'EnquiryForms', id);
// //         const docSnap = await getDoc(docRef);
// //         if (docSnap.exists()) {
// //           const data = docSnap.data();
// //           setFormTitle(data.title || 'Enquiry Form');
// //           const fields = data.fields || [];
// //           setFormFields(fields);

// //           // Initialize formData with default values
// //           const initialFormData = {};
// //           fields.forEach((field) => {
// //             if (field.defaultValue) {
// //               initialFormData[field.name] = field.defaultValue;
// //             }
// //           });
// //           setFormData(initialFormData);
// //         } else {
// //           setError('Form not found');
// //         }
// //       } catch (err) {
// //         setError(`Error fetching form: ${err.message}`);
// //       }
// //     };
// //     fetchFormFields();
// //   }, [id]);

// //   const handleChange = (e, fieldName) => {
// //     setFormData({ ...formData, [fieldName]: e.target.value });
// //   };

// //   const validateForm = () => {
// //     const errors = {};
// //     formFields.forEach((field) => {
// //       if (field.required && !formData[field.name]?.trim()) {
// //         errors[field.name] = `${field.label} is required`;
// //       }
// //       if (field.name === 'email' && formData[field.name]) {
// //         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //         if (!emailRegex.test(formData[field.name])) {
// //           errors[field.name] = 'Invalid email format';
// //         }
// //       }
// //     });
// //     return errors;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // Validate form
// //     const errors = validateForm();
// //     if (Object.keys(errors).length > 0) {
// //       setError(Object.values(errors)[0]); // Display first error
// //       return;
// //     }

// //     try {
// //       setError(null);

// //       // Prepare enquiry data
// //       const enquiryData = {
// //         formId: id,
// //         ...formData,
// //         submittedAt: new Date(),
// //       };

// //       // Normalize email for matching
// //       const email = formData.email?.trim().toLowerCase();
// //       let existingEnquiry = null;

// //       if (email) {
// //         // Check for existing enquiry by email
// //         const enquiriesRef = collection(db, 'Enquiries');
// //         const emailQuery = query(enquiriesRef, where('email', '==', email));
// //         const emailSnapshot = await getDocs(emailQuery);
// //         if (!emailSnapshot.empty) {
// //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// //         }
// //       }

// //       // Increment the enquiry count in EnquiryForms
// //       const formRef = doc(db, 'EnquiryForms', id);

// //       if (existingEnquiry) {
// //         // Replace existing enquiry, preserving createdAt
// //         const enquiryRef = doc(db, 'Enquiries', existingEnquiry.id);
// //         const updatedData = {
// //           ...enquiryData,
// //           createdAt: existingEnquiry.createdAt || new Date(),
// //         };
// //         await updateDoc(enquiryRef, updatedData);
// //         console.log(`Replaced existing enquiry with ID: ${existingEnquiry.id}`);
// //       } else {
// //         // Create new enquiry
// //         await addDoc(collection(db, 'Enquiries'), enquiryData);
// //         console.log('Created new enquiry');
// //       }

// //       // Update enquiry count
// //       await updateDoc(formRef, {
// //         enquiryCount: increment(1),
// //       });

// //       alert('Enquiry submitted successfully!');
// //       // Reset form
// //       const initialFormData = {};
// //       formFields.forEach((field) => {
// //         if (field.defaultValue) {
// //           initialFormData[field.name] = field.defaultValue;
// //         }
// //       });
// //       setFormData(initialFormData);
// //     } catch (err) {
// //       console.error('Error submitting enquiry:', err);
// //       setError(`Error submitting enquiry: ${err.message}`);
// //     }
// //   };

// //   if (error) {
// //     return (
// //       <div className="p-4 max-w-xl mx-auto">
// //         <h2 className="text-2xl font-bold text-red-600">{error}</h2>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 max-w-xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
// //       <form onSubmit={handleSubmit}>
// //         {formFields.map((field, index) => {
// //           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== '';

// //           return (
// //             <div key={index} className="mb-4">
// //               <label className="block font-medium">
// //                 {field.label}
// //                 {field.required && <span className="text-red-500">*</span>}
// //               </label>
// //               {hasDefaultValue ? (
// //                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
// //                   {field.defaultValue}
// //                 </p>
// //               ) : (
// //                 <input
// //                   type={field.type || 'text'}
// //                   placeholder={field.placeholder}
// //                   value={formData[field.name] || ''}
// //                   onChange={(e) => handleChange(e, field.name)}
// //                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   required={field.required}
// //                 />
// //               )}
// //             </div>
// //           );
// //         })}
// //         {error && <p className="text-red-500 mb-4">{error}</p>}
// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //         >
// //           Submit
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default EnquiryFormPage;




// // import { useParams } from 'react-router-dom';
// // import { useEffect, useState } from 'react';
// // import { db } from "../../../config/firebase";
// // import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';

// // const EnquiryFormPage = () => {
// //   const { id } = useParams();
// //   const [formFields, setFormFields] = useState([]);
// //   const [formData, setFormData] = useState({});
// //   const [formTitle, setFormTitle] = useState('');

// //   useEffect(() => {
// //     const fetchFormFields = async () => {
// //       const docRef = doc(db, 'EnquiryForms', id);
// //       const docSnap = await getDoc(docRef);
// //       if (docSnap.exists()) {
// //         const data = docSnap.data();
// //         setFormTitle(data.title || 'Enquiry Form');
// //         const fields = data.fields || [];
// //         setFormFields(fields);

// //         // Initialize formData with default values
// //         const initialFormData = {};
// //         fields.forEach((field) => {
// //           if (field.defaultValue) {
// //             initialFormData[field.name] = field.defaultValue;
// //           }
// //         });
// //         setFormData(initialFormData);
// //       }
// //     };
// //     fetchFormFields();
// //   }, [id]);

// //   const handleChange = (e, fieldName) => {
// //     setFormData({ ...formData, [fieldName]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     // Store the filled data in Enquiries collection
// //     await addDoc(collection(db, 'Enquiries'), {
// //       formId: id,
// //       ...formData,
// //       submittedAt: new Date(),
// //     });

// //     // Increment the enquiry count in EnquiryForms
// //     const formRef = doc(db, 'EnquiryForms', id);
// //     await updateDoc(formRef, {
// //       enquiryCount: increment(1),
// //     });

// //     alert('Enquiry submitted!');
// //   };

// //   return (
// //     <div className="p-4 max-w-xl mx-auto">
// //       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
// //       <form onSubmit={handleSubmit}>
// //         {formFields.map((field, index) => {
// //           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

// //           return (
// //             <div key={index} className="mb-4">
// //               <label className="block font-medium">{field.label}</label>
// //               {hasDefaultValue ? (
// //                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
// //                   {field.defaultValue}
// //                 </p>
// //               ) : (
// //                 <input
// //                   type={field.type || 'text'}
// //                   placeholder={field.placeholder}
// //                   value={formData[field.name] || ''}
// //                   onChange={(e) => handleChange(e, field.name)}
// //                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   required={field.required}
// //                 />
// //               )}
// //             </div>
// //           );
// //         })}

// //         <button
// //           type="submit"
// //           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //         >
// //           Submit
// //         </button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default EnquiryFormPage;



// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { db } from "../../../config/firebase";
// import { doc, getDoc, addDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

// const EnquiryFormPage = () => {
//   const { id } = useParams();
//   const [formFields, setFormFields] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [formTitle, setFormTitle] = useState('');
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchFormFields = async () => {
//       try {
//         const docRef = doc(db, "enquiryForms", id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFormTitle(data.name || "Enquiry Form");
//           const fields = data.fields || [];
//           // Merge options from allEnquiryFields
//           const enrichedFields = fields.map((field) => {
//             const fieldConfig = allEnquiryFields
//               .flatMap((category) => category.fields)
//               .find((f) => f.id === field.id);
//             return {
//               ...field,
//               type: fieldConfig?.type || "text",
//               label: fieldConfig?.label || field.name,
//               options: fieldConfig?.options || [], // Include options
//               required: fieldConfig?.required || false,
//             };
//           });
//           setFormFields(enrichedFields);

//           // Initialize formData with default values
//           const initialFormData = {};
//           enrichedFields.forEach((field) => {
//             if (field.defaultValue) {
//               initialFormData[field.name] = field.defaultValue;
//             }
//           });
//           const defaultUser = data.users?.[0] || data.roles?.[0] || "Form Submission";
//           initialFormData.createdBy = defaultUser;
//           initialFormData.owner = defaultUser;
//           initialFormData.assignedTo = defaultUser;
//           setFormData(initialFormData);
//         } else {
//           setError("Form not found");
//         }
//       } catch (err) {
//         setError(`Error fetching form: ${err.message}`);
//       }
//     };
//     fetchFormFields();
//   }, [id]);

//   // useEffect(() => {
//   //   const fetchFormFields = async () => {
//   //     try {
//   //       const docRef = doc(db, "enquiryForms", id); // Note: Collection name corrected to "enquiryForms"
//   //       const docSnap = await getDoc(docRef);
//   //       if (docSnap.exists()) {
//   //         const data = docSnap.data();
//   //         setFormTitle(data.name || "Enquiry Form");
//   //         const fields = data.fields || [];
//   //         setFormFields(fields);

//   //         // Initialize formData with default values
//   //         const initialFormData = {};
//   //         fields.forEach((field) => {
//   //           if (field.defaultValue) {
//   //             initialFormData[field.name] = field.defaultValue;
//   //           }
//   //         });

//   //         // Set default creator, owner, and assignedTo based on form's users or roles
//   //         const users = data.users || [];
//   //         const roles = data.roles || [];
//   //         const defaultUser = users.length > 0 ? users[0] : roles.length > 0 ? `Role: ${roles[0]}` : "Form Submission";
//   //         initialFormData.createdBy = defaultUser;
//   //         initialFormData.owner = defaultUser;
//   //         initialFormData.assignedTo = defaultUser;

//   //         setFormData(initialFormData);
//   //       } else {
//   //         setError("Form not found");
//   //       }
//   //     } catch (err) {
//   //       setError(`Error fetching form: ${err.message}`);
//   //     }
//   //   };
//   //   fetchFormFields();
//   // }, [id]);

//   // useEffect(() => {
//   //   const fetchFormFields = async () => {
//   //     try {
//   //       const docRef = doc(db, 'EnquiryForms', id);
//   //       const docSnap = await getDoc(docRef);
//   //       if (docSnap.exists()) {
//   //         const data = docSnap.data();
//   //         setFormTitle(data.title || 'Enquiry Form');
//   //         const fields = data.fields || [];
//   //         setFormFields(fields);

//   //         // Initialize formData with default values
//   //         const initialFormData = {};
//   //         fields.forEach((field) => {
//   //           if (field.defaultValue) {
//   //             initialFormData[field.name] = field.defaultValue;
//   //           }
//   //         });
//   //         setFormData(initialFormData);
//   //       } else {
//   //         setError('Form not found');
//   //       }
//   //     } catch (err) {
//   //       setError(`Error fetching form: ${err.message}`);
//   //     }
//   //   };
//   //   fetchFormFields();
//   // }, [id]);

//   const handleChange = (e, fieldName) => {
//     setFormData({ ...formData, [fieldName]: e.target.value });
//   };

//   const validateForm = () => {
//     const errors = {};
//     formFields.forEach((field) => {
//       if (field.required && !formData[field.name]?.trim()) {
//         errors[field.name] = `${field.label} is required`;
//       }
//       if (field.name === 'email' && formData[field.name]) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData[field.name])) {
//           errors[field.name] = 'Invalid email format';
//         }
//       }
//     });
//     return errors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setError(Object.values(errors)[0]);
//       return;
//     }

//     try {
//       setError(null);

//       // Fetch form data to get tags
//       const formRef = doc(db, "enquiryForms", id);
//       const formSnap = await getDoc(formRef);
//       const formDataFromDB = formSnap.exists() ? formSnap.data() : {};

//       // Prepare enquiry data
//       const enquiryData = {
//         formId: id,
//         ...formData,
//         stage: "pre-qualified",
//         submittedAt: new Date().toISOString(),
//         createdAt: new Date().toISOString(),
//         createdBy: formData.createdBy || "Form Submission",
//         owner: formData.owner || formData.createdBy || "Form Submission",
//         assignedTo: formData.assignedTo || formData.createdBy || "Form Submission",
//         tags: formDataFromDB.tags || [], // Include tags from form
//       };

//       // Normalize email and phone for matching
//       const email = formData.email?.trim().toLowerCase();
//       const phone = formData.phone?.trim();
//       let existingEnquiry = null;

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
//             existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
//             break;
//           }
//         }
//       }

//       if (existingEnquiry) {
//         // Update existing enquiry
//         const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
//         const updatedData = {
//           ...enquiryData,
//           createdAt: existingEnquiry.createdAt || new Date().toISOString(),
//           stage: "pre-qualified",
//           tags: [...new Set([...(existingEnquiry.tags || []), ...(formDataFromDB.tags || [])])], // Merge tags
//           history: [
//             ...(existingEnquiry.history || []),
//             {
//               action: `Enquiry updated via form ${id} due to matching ${email ? "email" : "phone"}`,
//               performedBy: "Form Submission",
//               timestamp: new Date().toISOString(),
//             },
//           ],
//         };
//         await updateDoc(enquiryRef, updatedData);
//         alert(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
//       } else {
//         // Create new enquiry
//         const newEnquiryRef = await addDoc(collection(db, "enquiries"), {
//           ...enquiryData,
//           history: [
//             {
//               action: `Enquiry created via form ${id}`,
//               performedBy: "Form Submission",
//               timestamp: new Date().toISOString(),
//             },
//           ],
//         });
//         console.log(`Created new enquiry with ID: ${newEnquiryRef.id}`);
//       }

//       // Update enquiry count
//       await updateDoc(formRef, {
//         enquiryCount: increment(1),
//       });

//       alert("Enquiry submitted successfully!");
//       const initialFormData = {};
//       formFields.forEach((field) => {
//         if (field.defaultValue) {
//           initialFormData[field.name] = field.defaultValue;
//         }
//       });
//       setFormData(initialFormData);
//     } catch (err) {
//       console.error("Error submitting enquiry:", err);
//       setError(`Error submitting enquiry: ${err.message}`);
//     }
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   // Validate form
//   //   const errors = validateForm();
//   //   if (Object.keys(errors).length > 0) {
//   //     setError(Object.values(errors)[0]);
//   //     return;
//   //   }

//   //   try {
//   //     setError(null);

//   //     // Prepare enquiry data
//   //     const enquiryData = {
//   //       formId: id,
//   //       ...formData,
//   //       stage: "pre-qualified",
//   //       submittedAt: new Date().toISOString(),
//   //       createdAt: new Date().toISOString(),
//   //       createdBy: formData.createdBy || "Form Submission",
//   //       owner: formData.owner || formData.createdBy || "Form Submission",
//   //       assignedTo: formData.assignedTo || formData.createdBy || "Form Submission",
//   //     };

//   //     // Normalize email and phone for matching
//   //     const email = formData.email?.trim().toLowerCase();
//   //     const phone = formData.phone?.trim();
//   //     let existingEnquiry = null;

//   //     const enquiriesRef = collection(db, "enquiries");
//   //     const queries = [];
//   //     if (email) {
//   //       queries.push(query(enquiriesRef, where("email", "==", email)));
//   //     }
//   //     if (phone) {
//   //       queries.push(query(enquiriesRef, where("phone", "==", phone)));
//   //     }

//   //     if (queries.length > 0) {
//   //       const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
//   //       for (const snapshot of snapshots) {
//   //         if (!snapshot.empty) {
//   //           existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
//   //           break;
//   //         }
//   //       }
//   //     }

//   //     // Increment the enquiry count in EnquiryForms
//   //     const formRef = doc(db, "enquiryForms", id);

//   //     if (existingEnquiry) {
//   //       // Update existing enquiry
//   //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
//   //       const updatedData = {
//   //         ...enquiryData,
//   //         createdAt: existingEnquiry.createdAt || new Date().toISOString(),
//   //         stage: "pre-qualified",
//   //         history: [
//   //           ...(existingEnquiry.history || []),
//   //           {
//   //             action: `Enquiry updated via form ${id} due to matching ${email ? "email" : "phone"}`,
//   //             performedBy: "Form Submission",
//   //             timestamp: new Date().toISOString(),
//   //           },
//   //         ],
//   //       };
//   //       await updateDoc(enquiryRef, updatedData);
//   //       alert(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
//   //     } else {
//   //       // Create new enquiry
//   //       const newEnquiryRef = await addDoc(collection(db, "enquiries"), {
//   //         ...enquiryData,
//   //         history: [
//   //           {
//   //             action: `Enquiry created via form ${id}`,
//   //             performedBy: "Form Submission",
//   //             timestamp: new Date().toISOString(),
//   //           },
//   //         ],
//   //       });
//   //       console.log(`Created new enquiry with ID: ${newEnquiryRef.id}`);
//   //     }

//   //     // Update enquiry count
//   //     await updateDoc(formRef, {
//   //       enquiryCount: increment(1),
//   //     });

//   //     alert("Enquiry submitted successfully!");
//   //     const initialFormData = {};
//   //     formFields.forEach((field) => {
//   //       if (field.defaultValue) {
//   //         initialFormData[field.name] = field.defaultValue;
//   //       }
//   //     });
//   //     setFormData(initialFormData);
//   //   } catch (err) {
//   //     console.error("Error submitting enquiry:", err);
//   //     setError(`Error submitting enquiry: ${err.message}`);
//   //   }
//   // };


//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();

//   //   // Validate form
//   //   const errors = validateForm();
//   //   if (Object.keys(errors).length > 0) {
//   //     setError(Object.values(errors)[0]);
//   //     return;
//   //   }

//   //   try {
//   //     setError(null);

//   //     // Prepare enquiry data
//   //     const enquiryData = {
//   //       formId: id,
//   //       ...formData,
//   //       stage: "pre-qualified", // Ensure stage is set for all cases
//   //       submittedAt: new Date().toISOString(),
//   //       createdAt: new Date().toISOString(), // Set createdAt for new enquiries
//   //       createdBy: formData.createdBy || "Form Submission", // Default creator
//   //       owner: formData.owner || formData.createdBy || "Form Submission", // Default owner
//   //       assignedTo: formData.assignedTo || formData.createdBy || "Form Submission", // Default assignedTo
//   //     };

//   //     // Normalize email for matching
//   //     const email = formData.email?.trim().toLowerCase();
//   //     let existingEnquiry = null;

//   //     if (email) {
//   //       const enquiriesRef = collection(db, "enquiries");
//   //       const emailQuery = query(enquiriesRef, where("email", "==", email));
//   //       const emailSnapshot = await getDocs(emailQuery);
//   //       if (!emailSnapshot.empty) {
//   //         existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
//   //       }
//   //     }

//   //     // Increment the enquiry count in EnquiryForms
//   //     const formRef = doc(db, "EnquiryForms", id);

//   //     if (existingEnquiry) {
//   //       // Update existing enquiry
//   //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
//   //       const updatedData = {
//   //         ...enquiryData,
//   //         createdAt: existingEnquiry.createdAt || new Date().toISOString(),
//   //         stage: "pre-qualified", // Ensure stage is updated to pre-qualified
//   //         history: [
//   //           ...(existingEnquiry.history || []),
//   //           {
//   //             action: `Enquiry updated via form ${id}`,
//   //             performedBy: "Form Submission",
//   //             timestamp: new Date().toISOString(),
//   //           },
//   //         ],
//   //       };
//   //       await updateDoc(enquiryRef, updatedData);
//   //       console.log(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
//   //     } else {
//   //       // Create new enquiry
//   //       const newEnquiryRef = await addDoc(collection(db, "enquiries"), {
//   //         ...enquiryData,
//   //         history: [
//   //           {
//   //             action: `Enquiry created via form ${id}`,
//   //             performedBy: "Form Submission",
//   //             timestamp: new Date().toISOString(),
//   //           },
//   //         ],
//   //       });
//   //       console.log(`Created new enquiry with ID: ${newEnquiryRef.id}`);
//   //     }

//   //     // Update enquiry count
//   //     await updateDoc(formRef, {
//   //       enquiryCount: increment(1),
//   //     });

//   //     alert("Enquiry submitted successfully!");
//   //     // Reset form
//   //     const initialFormData = {};
//   //     formFields.forEach((field) => {
//   //       if (field.defaultValue) {
//   //         initialFormData[field.name] = field.defaultValue;
//   //       }
//   //     });
//   //     setFormData(initialFormData);
//   //   } catch (err) {
//   //     console.error("Error submitting enquiry:", err);
//   //     setError(`Error submitting enquiry: ${err.message}`);
//   //   }
//   // };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     // Validate form
// //     const errors = validateForm();
// //     if (Object.keys(errors).length > 0) {
// //       setError(Object.values(errors)[0]); // Display first error
// //       return;
// //     }

// //     try {
// //       setError(null);

// //       // Prepare enquiry data
// //       const enquiryData = {
// //         formId: id,
// //         ...formData,
// //         stage: "pre-qualified", // Set stage to "pre-qualified" for new enquiries
// //         submittedAt: new Date(),
// //       };

// //       // Normalize email for matching
// //       const email = formData.email?.trim().toLowerCase();
// //       let existingEnquiry = null;

// //       if (email) {
// //         // Check for existing enquiry by email
// //         const enquiriesRef = collection(db, "Enquiries");
// //         const emailQuery = query(enquiriesRef, where("email", "==", email));
// //         const emailSnapshot = await getDocs(emailQuery);
// //         if (!emailSnapshot.empty) {
// //           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
// //         }
// //       }

// //       // Increment the enquiry count in EnquiryForms
// //       const formRef = doc(db, "EnquiryForms", id);

// //       if (existingEnquiry) {
// //         // Replace existing enquiry, preserving createdAt
// //         const enquiryRef = doc(db, "Enquiries", existingEnquiry.id);
// //         const updatedData = {
// //           ...enquiryData,
// //           createdAt: existingEnquiry.createdAt || new Date(),
// //           stage: formData.stage || existingEnquiry.stage || "pre-qualified", // Preserve existing stage or set to "pre-qualified"
// //         };
// //         await updateDoc(enquiryRef, updatedData);
// //         console.log(`Replaced existing enquiry with ID: ${existingEnquiry.id}`);
// //       } else {
// //         // Create new enquiry
// //         await addDoc(collection(db, "Enquiries"), enquiryData);
// //         console.log("Created new enquiry");
// //       }

// //       // Update enquiry count
// //       await updateDoc(formRef, {
// //         enquiryCount: increment(1),
// //       });

// //       alert("Enquiry submitted successfully!");
// //       // Reset form
// //       const initialFormData = {};
// //       formFields.forEach((field) => {
// //         if (field.defaultValue) {
// //           initialFormData[field.name] = field.defaultValue;
// //         }
// //       });
// //       setFormData(initialFormData);
// //     } catch (err) {
// //       console.error("Error submitting enquiry:", err);
// //       setError(`Error submitting enquiry: ${err.message}`);
// //     }

// // };



//   if (error) {
//     return (
//       <div className="p-4 max-w-xl mx-auto">
//         <h2 className="text-2xl font-bold text-red-600">{error}</h2>
//       </div>
//     );
//   }

//   return (
//     // <div className="p-4 max-w-xl mx-auto">
//     //   <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
//     //   <form onSubmit={handleSubmit}>
//     //     {formFields.map((field, index) => {
//     //       const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== '';

//     //       return (
//     //         <div key={index} className="mb-4">
//     //           <label className="block font-medium">
//     //             {field.label}
//     //             {field.required && <span className="text-red-500">*</span>}
//     //           </label>
//     //           {hasDefaultValue ? (
//     //             <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
//     //               {field.defaultValue}
//     //             </p>
//     //           ) : (
//     //             <input
//     //               type={field.type || 'text'}
//     //               placeholder={field.placeholder}
//     //               value={formData[field.name] || ''}
//     //               onChange={(e) => handleChange(e, field.name)}
//     //               className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//     //               required={field.required}
//     //             />
//     //           )}
//     //         </div>
//     //       );
//     //     })}
//     //     {error && <p className="text-red-500 mb-4">{error}</p>}
//     //     <button
//     //       type="submit"
//     //       className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//     //     >
//     //       Submit
//     //     </button>
//     //   </form>
//     // </div>

//     <div className="p-4 max-w-xl mx-auto">
//     <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
//     <form onSubmit={handleSubmit}>
//       {formFields.map((field, index) => {
//         const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";
//         return (
//           <div key={index} className="mb-4">
//             <label className="block font-medium">
//               {field.label}
//               {field.required && <span className="text-red-500">*</span>}
//             </label>
//             {hasDefaultValue ? (
//               <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
//                 {field.defaultValue}
//               </p>
//             ) : field.type === "select" ? (
//               <select
//                 value={formData[field.name] || ""}
//                 onChange={(e) => handleChange(e, field.name)}
//                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required={field.required}
//               >
//                 <option value="">Select {field.label}</option>
//                 {field.options?.map((option) => (
//                   <option key={option} value={option}>
//                     {option}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={field.type || "text"}
//                 placeholder={field.placeholder || field.label}
//                 value={formData[field.name] || ""}
//                 onChange={(e) => handleChange(e, field.name)}
//                 className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required={field.required}
//               />
//             )}
//           </div>
//         );
//       })}
//       {error && <p className="text-red-500 mb-4">{error}</p>}
//       <button
//         type="submit"
//         className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//       >
//         Submit
//       </button>
//     </form>
//   </div>

//   );
// };

// export default EnquiryFormPage;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../../config/firebase";
import { doc, getDoc, addDoc, updateDoc, increment, collection, query, where, getDocs } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";

const EnquiryFormPage = () => {
  const { id } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formTitle, setFormTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const docRef = doc(db, "enquiryForms", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormTitle(data.name || "Enquiry Form");
          const fields = data.fields || [];
          // Merge options from allEnquiryFields
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
          // const enrichedFields = fields.map((field) => {
          //   const fieldConfig = allEnquiryFields
          //     .flatMap((category) => category.fields)
          //     .find((f) => f.id === field.id);
          //   return {
          //     ...field,
          //     name: field.id, // Ensure consistency
          //     type: fieldConfig?.type || "text",
          //     label: fieldConfig?.label || field.id,
          //     options: fieldConfig?.options || [],
          //     required: fieldConfig?.required || false,
          //   };
          // });
          setFormFields(enrichedFields);

          // Initialize formData with default values
          const initialFormData = {};
          enrichedFields.forEach((field) => {
            if (field.defaultValue) {
              initialFormData[field.name] = field.defaultValue;
            }
          });
          const defaultUser = data.users?.[0] || data.roles?.[0] || "Form Submission";
          initialFormData.createdBy = defaultUser;
          initialFormData.owner = defaultUser;
          initialFormData.assignedTo = defaultUser;
          setFormData(initialFormData);
        } else {
          setError("Form not found");
        }
      } catch (err) {
        setError(`Error fetching form: ${err.message}`);
      }
    };
    fetchFormFields();
  }, [id]);

  const handleChange = (e, fieldName) => {
    setFormData({ ...formData, [fieldName]: e.target.value });
  };

  const validateForm = () => {
    const errors = {};
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]?.trim()) {
        errors[field.name] = `${field.label} is required`;
      }
      if (field.name === "email" && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          errors[field.name] = "Invalid email format";
        }
      }
      if (field.name === "phone" && formData[field.name]) {
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData[field.name])) {
          errors[field.name] = "Phone number must be 10 digits";
        }
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]);
      return;
    }
  
    try {
      setError(null);
      const formRef = doc(db, "enquiryForms", id);
      const formSnap = await getDoc(formRef);
      // const formDataFromDB = formSnap.exists() ? formSnap.data() : {};
      const email = formData.email?.trim().toLowerCase();
      const phone = formData.phone?.trim();
      let existingEnquiry = null;
  
      const enquiriesRef = collection(db, "enquiries");
      const queries = [];
      if (email) queries.push(query(enquiriesRef, where("email", "==", email)));
      if (phone) queries.push(query(enquiriesRef, where("phone", "==", phone)));
  
      console.log("Duplicate check queries:", queries); // Debug
      if (queries.length > 0) {
        const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
        console.log("Query snapshots:", snapshots.map(s => s.docs)); // Debug
        for (const snapshot of snapshots) {
          if (!snapshot.empty) {
            existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
            break;
          }
        }
      }
      const formDataFromDB = formSnap.exists() ? formSnap.data() : {};
      const assignedUser = formDataFromDB.users?.[0] || formDataFromDB.roles?.[0] || "Form Submission";
      // const assignedUser = formDataFromDB.users?.[0] || formDataFromDB.roles?.[0] || "Form Submission";
      if (existingEnquiry) {
        setExistingEnquiry(existingEnquiry);
        setShowPrompt(true);
        return;
      }

      const enquiryData = {
        formId: id,
        ...formData,
        stage: "pre-qualified",
        submittedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        lastModifiedTime: new Date().toISOString(),
        lastTouched: new Date().toISOString(),
        createdBy: assignedUser,
        owner: assignedUser,
        assignedTo: assignedUser,
        tags: formDataFromDB.tags || [],
        history: [
          {
            action: `Enquiry created via form "${formDataFromDB.name}" (ID: ${id})`,
            performedBy: assignedUser,
            timestamp: new Date().toISOString(),
            formName: formDataFromDB.name,
          },
        ],
      };
  
      // const enquiryData = {
      //   formId: id,
      //   ...formData,
      //   stage: "pre-qualified",
      //   submittedAt: new Date().toISOString(),
      //   createdAt: new Date().toISOString(),
      //   lastModifiedTime: new Date().toISOString(),
      //   lastTouched: new Date().toISOString(),
      //   createdBy: assignedUser,
      //   owner: assignedUser,
      //   assignedTo: assignedUser,
      //   tags: formDataFromDB.tags || [],
      //   history: [
      //     ...(existingEnquiry.history || []),
      //     {
      //       action: `Enquiry updated via form ${id} due to matching ${email ? "email" : "phone"}`,
      //       performedBy: "Form Submission",
      //       timestamp: new Date().toISOString(),
      //     },
      //   ]
      //   // history: [
      //   //   {
      //   //     action: `Enquiry created via form ${id}`,
      //   //     performedBy: assignedUser,
      //   //     timestamp: new Date().toISOString(),
      //   //   },
      //   // ],
      // };

      if (existingEnquiry) {
        const updatedData = {
          ...enquiryData,
          createdAt: existingEnquiry.createdAt || new Date().toISOString(),
          lastModifiedTime: new Date().toISOString(),
          lastTouched: new Date().toISOString(),
          history: [
            ...(existingEnquiry.history || []),
            {
              action: `Enquiry updated via form "${formDataFromDB.name}" (ID: ${id}) due to matching ${email ? "email" : "phone"}`,
              performedBy: assignedUser,
              timestamp: new Date().toISOString(),
              formName: formDataFromDB.name,
            },
          ],
        };
        await updateDoc(enquiriesRef, updatedData);
      } else {
        await addDoc(collection(db, "enquiries"), enquiryData);
      }


      const newEnquiryRef = await addDoc(collection(db, "enquiries"), enquiryData);
      await updateDoc(formRef, { enquiryCount: increment(1) });
      alert("Enquiry submitted successfully!");
      resetForm();
    } catch (err) {
      setError(`Error submitting enquiry: ${err.message}`);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setError(Object.values(errors)[0]);
  //     return;
  //   }
  
  //   try {
  //     setError(null);
  //     const formRef = doc(db, "enquiryForms", id);
  //     const formSnap = await getDoc(formRef);
  //     const formDataFromDB = formSnap.exists() ? formSnap.data() : {};
      
  //     // Determine assigned user/role
  //     const assignedUser = formDataFromDB.users?.[0] || formDataFromDB.roles?.[0] || "Form Submission";
      
  //     const enquiryData = {
  //       formId: id,
  //       ...formData,
  //       stage: "pre-qualified",
  //       submittedAt: new Date().toISOString(),
  //       createdAt: new Date().toISOString(),
  //       lastModifiedTime: new Date().toISOString(),
  //       lastTouched: new Date().toISOString(),
  //       createdBy: assignedUser,
  //       owner: assignedUser,
  //       assignedTo: assignedUser,
  //       tags: formDataFromDB.tags || [],
  //       history: [
  //         {
  //           action: `Enquiry created via form ${id}`,
  //           performedBy: assignedUser,
  //           timestamp: new Date().toISOString(),
  //         },
  //       ],
  //     };
  
  //     // Existing enquiry check (as before)
  //     const email = formData.email?.trim().toLowerCase();
  //     const phone = formData.phone?.trim();
  //     let existingEnquiry = null;
  //     const enquiriesRef = collection(db, "enquiries");
  //     const queries = [];
  //     if (email) queries.push(query(enquiriesRef, where("email", "==", email)));
  //     if (phone) queries.push(query(enquiriesRef, where("phone", "==", phone)));
  
  //     if (queries.length > 0) {
  //       const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
  //       for (const snapshot of snapshots) {
  //         if (!snapshot.empty) {
  //           existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  //           break;
  //         }
  //       }
  //     }
  
  //     if (existingEnquiry) {
  //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
  //       const updatedData = {
  //         ...enquiryData,
  //         createdAt: existingEnquiry.createdAt || new Date().toISOString(),
  //         lastModifiedTime: new Date().toISOString(),
  //         lastTouched: new Date().toISOString(),
  //         history: [
  //           ...(existingEnquiry.history || []),
  //           {
  //             action: `Enquiry updated via form ${id} due to matching ${email ? "email" : "phone"}`,
  //             performedBy: assignedUser,
  //             timestamp: new Date().toISOString(),
  //           },
  //         ],
  //       };
  //       await updateDoc(enquiryRef, updatedData);
  //       await updateDoc(formRef, { enquiryCount: increment(1) });
  //       alert(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
  //     } else {
  //       const newEnquiryRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //       await updateDoc(formRef, { enquiryCount: increment(1) });
  //       alert("Enquiry submitted successfully!");
  //     }
  
  //     resetForm();
  //   } catch (err) {
  //     setError(`Error submitting enquiry: ${err.message}`);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setError(Object.values(errors)[0]);
  //     return;
  //   }

  //   try {
  //     setError(null);
  //     const formRef = doc(db, "enquiryForms", id);
  //     const formSnap = await getDoc(formRef);
  //     const formDataFromDB = formSnap.exists() ? formSnap.data() : {};
  //     const email = formData.email?.trim().toLowerCase();
  //     const phone = formData.phone?.trim();
  //     let existingEnquiry = null;

  //     const enquiriesRef = collection(db, "enquiries");
  //     const queries = [];
  //     if (email) {
  //       queries.push(query(enquiriesRef, where("email", "==", email)));
  //     }
  //     if (phone) {
  //       queries.push(query(enquiriesRef, where("phone", "==", phone)));
  //     }

  //     if (queries.length > 0) {
  //       const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
  //       for (const snapshot of snapshots) {
  //         if (!snapshot.empty) {
  //           existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  //           break;
  //         }
  //       }
  //     }

  //     if (existingEnquiry) {
  //       setExistingEnquiry(existingEnquiry);
  //       setShowPrompt(true); // New state for prompt
  //       return;
  //     }

  //     // Create new enquiry if no match
  //     const enquiryData = {
  //       formId: id,
  //       ...formData,
  //       stage: "pre-qualified",
  //       submittedAt: new Date().toISOString(),
  //       createdAt: new Date().toISOString(),
  //       createdBy: formData.createdBy || "Form Submission",
  //       owner: formData.owner || formData.createdBy || "Form Submission",
  //       assignedTo: formData.assignedTo || formData.createdBy || "Form Submission",
  //       tags: formDataFromDB.tags || [],
  //       history: [
  //         {
  //           action: `Enquiry created via form ${id}`,
  //           performedBy: "Form Submission",
  //           timestamp: new Date().toISOString(),
  //         },
  //       ],
  //     };
  //     const newEnquiryRef = await addDoc(collection(db, "enquiries"), enquiryData);
  //     await updateDoc(formRef, { enquiryCount: increment(1) });
  //     alert("Enquiry submitted successfully!");
  //     resetForm();
  //   } catch (err) {
  //     setError(`Error submitting enquiry: ${err.message}`);
  //   }
  // };

  // Add prompt state and handler
  const [showPrompt, setShowPrompt] = useState(false);
  const [existingEnquiry, setExistingEnquiry] = useState(null);

  const handlePromptResponse = async (keepPrevious) => {
    setShowPrompt(false);
    try {
      if (keepPrevious) {
        alert("Kept existing enquiry.");
        resetForm();
        return;
      }

      const formRef = doc(db, "enquiryForms", id);
      const formSnap = await getDoc(formRef);
      const formDataFromDB = formSnap.exists() ? formSnap.data() : {};
      const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
      const updatedData = {
        formId: id,
        ...formData,
        stage: "pre-qualified",
        submittedAt: new Date().toISOString(),
        createdAt: existingEnquiry.createdAt || new Date().toISOString(),
        createdBy: formData.createdBy || "Form Submission",
        owner: formData.owner || formData.createdBy || "Form Submission",
        assignedTo: formData.assignedTo || formData.createdBy || "Form Submission",
        tags: [...new Set([...(existingEnquiry.tags || []), ...(formDataFromDB.tags || [])])],
        history: [
          ...(existingEnquiry.history || []),
          {
            action: `Enquiry updated via form ${id} due to matching ${formData.email ? "email" : "phone"}`,
            performedBy: "Form Submission",
            timestamp: new Date().toISOString(),
          },
        ],
      };
      await updateDoc(enquiryRef, updatedData);
      await updateDoc(formRef, { enquiryCount: increment(1) });
      alert(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
      resetForm();
    } catch (err) {
      setError(`Error processing enquiry: ${err.message}`);
    }
  };

  const resetForm = () => {
    const initialFormData = {};
    formFields.forEach((field) => {
      if (field.defaultValue) {
        initialFormData[field.name] = field.defaultValue;
      }
    });
    setFormData(initialFormData);
    setExistingEnquiry(null);
  };

  // Add prompt UI in render


  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate form
  //   const errors = validateForm();
  //   if (Object.keys(errors).length > 0) {
  //     setError(Object.values(errors)[0]);
  //     return;
  //   }

  //   try {
  //     setError(null);

  //     // Fetch form data to get tags
  //     const formRef = doc(db, "enquiryForms", id);
  //     const formSnap = await getDoc(formRef);
  //     const formDataFromDB = formSnap.exists() ? formSnap.data() : {};

  //     // Prepare enquiry data
  //     const enquiryData = {
  //       formId: id,
  //       ...formData,
  //       stage: "pre-qualified",
  //       submittedAt: new Date().toISOString(),
  //       createdAt: new Date().toISOString(),
  //       createdBy: formData.createdBy || "Form Submission",
  //       owner: formData.owner || formData.createdBy || "Form Submission",
  //       assignedTo: formData.assignedTo || formData.createdBy || "Form Submission",
  //       tags: formDataFromDB.tags || [],
  //     };

  //     // Normalize email and phone for matching
  //     const email = formData.email?.trim().toLowerCase();
  //     const phone = formData.phone?.trim();
  //     let existingEnquiry = null;

  //     const enquiriesRef = collection(db, "enquiries");
  //     const queries = [];
  //     if (email) {
  //       queries.push(query(enquiriesRef, where("email", "==", email)));
  //     }
  //     if (phone) {
  //       queries.push(query(enquiriesRef, where("phone", "==", phone)));
  //     }

  //     if (queries.length > 0) {
  //       const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
  //       for (const snapshot of snapshots) {
  //         if (!snapshot.empty) {
  //           existingEnquiry = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  //           break;
  //         }
  //       }
  //     }

  //     if (existingEnquiry) {
  //       // Update existing enquiry
  //       const enquiryRef = doc(db, "enquiries", existingEnquiry.id);
  //       const updatedData = {
  //         ...enquiryData,
  //         createdAt: existingEnquiry.createdAt || new Date().toISOString(),
  //         stage: "pre-qualified",
  //         tags: [...new Set([...(existingEnquiry.tags || []), ...(formDataFromDB.tags || [])])],
  //         history: [
  //           ...(existingEnquiry.history || []),
  //           {
  //             action: `Enquiry updated via form ${id} due to matching ${email ? "email" : "phone"}`,
  //             performedBy: "Form Submission",
  //             timestamp: new Date().toISOString(),
  //           },
  //         ],
  //       };
  //       await updateDoc(enquiryRef, updatedData);
  //       alert(`Updated existing enquiry with ID: ${existingEnquiry.id}`);
  //     } else {
  //       // Create new enquiry
  //       const newEnquiryRef = await addDoc(collection(db, "enquiries"), {
  //         ...enquiryData,
  //         history: [
  //           {
  //             action: `Enquiry created via form ${id}`,
  //             performedBy: "Form Submission",
  //             timestamp: new Date().toISOString(),
  //           },
  //         ],
  //       });
  //       console.log(`Created new enquiry with ID: ${newEnquiryRef.id}`);
  //     }

  //     // Update enquiry count
  //     await updateDoc(formRef, {
  //       enquiryCount: increment(1),
  //     });

  //     alert("Enquiry submitted successfully!");
  //     const initialFormData = {};
  //     formFields.forEach((field) => {
  //       if (field.defaultValue) {
  //         initialFormData[field.name] = field.defaultValue;
  //       }
  //     });
  //     setFormData(initialFormData);
  //   } catch (err) {
  //     console.error("Error submitting enquiry:", err);
  //     setError(`Error submitting enquiry: ${err.message}`);
  //   }
  // };

  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
      <form onSubmit={handleSubmit}>
        {formFields.map((field, index) => {
          const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";
          return (
            <div key={index} className="mb-4">
              <label className="block font-medium">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {hasDefaultValue ? (
                <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
                  {field.defaultValue}
                </p>
              ) : field.type === "select" ? (
                <select
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(e, field.name)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(e, field.name)}
                  placeholder={field.placeholder || field.label}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                  rows={4}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  placeholder={field.placeholder || field.label}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(e, field.name)}
                  className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={field.required}
                />
              )}
            </div>
          );
        })}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>


        {showPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Duplicate Enquiry Detected</h3>
              <p className="text-gray-600 mb-4">
                An enquiry with the {formData.email ? "email" : "phone"} "{formData.email || formData.phone}" already exists:
              </p>
              <div className="mb-4 p-4 bg-gray-100 rounded-md">
                <p><strong>Name:</strong> {existingEnquiry?.name || "N/A"}</p>
                <p><strong>Email:</strong> {existingEnquiry?.email || "N/A"}</p>
                <p><strong>Phone:</strong> {existingEnquiry?.phone || "N/A"}</p>
                <p><strong>Stage:</strong> {existingEnquiry?.stage || "N/A"}</p>
                <p><strong>Created At:</strong> {existingEnquiry?.createdAt || "N/A"}</p>
              </div>
              <p className="text-gray-600 mb-4">
                Do you want to keep the previous enquiry or update it with this new one?
              </p>
              <div className="flex justify-end space-x-2">
                <Button
                  color="gray"
                  onClick={() => handlePromptResponse(true)}
                >
                  Keep Previous
                </Button>
                <Button
                  color="blue"
                  onClick={() => handlePromptResponse(false)}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default EnquiryFormPage;