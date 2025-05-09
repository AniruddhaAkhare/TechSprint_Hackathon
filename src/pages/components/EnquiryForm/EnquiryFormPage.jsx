

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
//         const docRef = doc(db, 'EnquiryForms', id);
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const data = docSnap.data();
//           setFormTitle(data.title || 'Enquiry Form');
//           const fields = data.fields || [];
//           setFormFields(fields);

//           // Initialize formData with default values
//           const initialFormData = {};
//           fields.forEach((field) => {
//             if (field.defaultValue) {
//               initialFormData[field.name] = field.defaultValue;
//             }
//           });
//           setFormData(initialFormData);
//         } else {
//           setError('Form not found');
//         }
//       } catch (err) {
//         setError(`Error fetching form: ${err.message}`);
//       }
//     };
//     fetchFormFields();
//   }, [id]);

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
//       setError(Object.values(errors)[0]); // Display first error
//       return;
//     }

//     try {
//       setError(null);

//       // Prepare enquiry data
//       const enquiryData = {
//         formId: id,
//         ...formData,
//         submittedAt: new Date(),
//       };

//       // Normalize email for matching
//       const email = formData.email?.trim().toLowerCase();
//       let existingEnquiry = null;

//       if (email) {
//         // Check for existing enquiry by email
//         const enquiriesRef = collection(db, 'Enquiries');
//         const emailQuery = query(enquiriesRef, where('email', '==', email));
//         const emailSnapshot = await getDocs(emailQuery);
//         if (!emailSnapshot.empty) {
//           existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
//         }
//       }

//       // Increment the enquiry count in EnquiryForms
//       const formRef = doc(db, 'EnquiryForms', id);

//       if (existingEnquiry) {
//         // Replace existing enquiry, preserving createdAt
//         const enquiryRef = doc(db, 'Enquiries', existingEnquiry.id);
//         const updatedData = {
//           ...enquiryData,
//           createdAt: existingEnquiry.createdAt || new Date(),
//         };
//         await updateDoc(enquiryRef, updatedData);
//         console.log(`Replaced existing enquiry with ID: ${existingEnquiry.id}`);
//       } else {
//         // Create new enquiry
//         await addDoc(collection(db, 'Enquiries'), enquiryData);
//         console.log('Created new enquiry');
//       }

//       // Update enquiry count
//       await updateDoc(formRef, {
//         enquiryCount: increment(1),
//       });

//       alert('Enquiry submitted successfully!');
//       // Reset form
//       const initialFormData = {};
//       formFields.forEach((field) => {
//         if (field.defaultValue) {
//           initialFormData[field.name] = field.defaultValue;
//         }
//       });
//       setFormData(initialFormData);
//     } catch (err) {
//       console.error('Error submitting enquiry:', err);
//       setError(`Error submitting enquiry: ${err.message}`);
//     }
//   };

//   if (error) {
//     return (
//       <div className="p-4 max-w-xl mx-auto">
//         <h2 className="text-2xl font-bold text-red-600">{error}</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
//       <form onSubmit={handleSubmit}>
//         {formFields.map((field, index) => {
//           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== '';

//           return (
//             <div key={index} className="mb-4">
//               <label className="block font-medium">
//                 {field.label}
//                 {field.required && <span className="text-red-500">*</span>}
//               </label>
//               {hasDefaultValue ? (
//                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
//                   {field.defaultValue}
//                 </p>
//               ) : (
//                 <input
//                   type={field.type || 'text'}
//                   placeholder={field.placeholder}
//                   value={formData[field.name] || ''}
//                   onChange={(e) => handleChange(e, field.name)}
//                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required={field.required}
//                 />
//               )}
//             </div>
//           );
//         })}
//         {error && <p className="text-red-500 mb-4">{error}</p>}
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EnquiryFormPage;




// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import { db } from "../../../config/firebase";
// import { doc, getDoc, collection, addDoc, updateDoc, increment } from 'firebase/firestore';

// const EnquiryFormPage = () => {
//   const { id } = useParams();
//   const [formFields, setFormFields] = useState([]);
//   const [formData, setFormData] = useState({});
//   const [formTitle, setFormTitle] = useState('');

//   useEffect(() => {
//     const fetchFormFields = async () => {
//       const docRef = doc(db, 'EnquiryForms', id);
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         const data = docSnap.data();
//         setFormTitle(data.title || 'Enquiry Form');
//         const fields = data.fields || [];
//         setFormFields(fields);

//         // Initialize formData with default values
//         const initialFormData = {};
//         fields.forEach((field) => {
//           if (field.defaultValue) {
//             initialFormData[field.name] = field.defaultValue;
//           }
//         });
//         setFormData(initialFormData);
//       }
//     };
//     fetchFormFields();
//   }, [id]);

//   const handleChange = (e, fieldName) => {
//     setFormData({ ...formData, [fieldName]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Store the filled data in Enquiries collection
//     await addDoc(collection(db, 'Enquiries'), {
//       formId: id,
//       ...formData,
//       submittedAt: new Date(),
//     });

//     // Increment the enquiry count in EnquiryForms
//     const formRef = doc(db, 'EnquiryForms', id);
//     await updateDoc(formRef, {
//       enquiryCount: increment(1),
//     });

//     alert('Enquiry submitted!');
//   };

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-2xl font-bold mb-4">{formTitle}</h2>
//       <form onSubmit={handleSubmit}>
//         {formFields.map((field, index) => {
//           const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";

//           return (
//             <div key={index} className="mb-4">
//               <label className="block font-medium">{field.label}</label>
//               {hasDefaultValue ? (
//                 <p className="border p-2 w-full bg-gray-100 text-gray-600 rounded">
//                   {field.defaultValue}
//                 </p>
//               ) : (
//                 <input
//                   type={field.type || 'text'}
//                   placeholder={field.placeholder}
//                   value={formData[field.name] || ''}
//                   onChange={(e) => handleChange(e, field.name)}
//                   className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required={field.required}
//                 />
//               )}
//             </div>
//           );
//         })}
       
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EnquiryFormPage;



import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from "../../../config/firebase";
import { doc, getDoc, addDoc, updateDoc, increment, collection, query, where, getDocs } from 'firebase/firestore';

const EnquiryFormPage = () => {
  const { id } = useParams();
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [formTitle, setFormTitle] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const docRef = doc(db, 'EnquiryForms', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormTitle(data.title || 'Enquiry Form');
          const fields = data.fields || [];
          setFormFields(fields);

          // Initialize formData with default values
          const initialFormData = {};
          fields.forEach((field) => {
            if (field.defaultValue) {
              initialFormData[field.name] = field.defaultValue;
            }
          });
          setFormData(initialFormData);
        } else {
          setError('Form not found');
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
      if (field.name === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          errors[field.name] = 'Invalid email format';
        }
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError(Object.values(errors)[0]); // Display first error
      return;
    }

    try {
      setError(null);

      // Prepare enquiry data
      const enquiryData = {
        formId: id,
        ...formData,
        submittedAt: new Date(),
      };

      // Normalize email for matching
      const email = formData.email?.trim().toLowerCase();
      let existingEnquiry = null;

      if (email) {
        // Check for existing enquiry by email
        const enquiriesRef = collection(db, 'Enquiries');
        const emailQuery = query(enquiriesRef, where('email', '==', email));
        const emailSnapshot = await getDocs(emailQuery);
        if (!emailSnapshot.empty) {
          existingEnquiry = { id: emailSnapshot.docs[0].id, ...emailSnapshot.docs[0].data() };
        }
      }

      // Increment the enquiry count in EnquiryForms
      const formRef = doc(db, 'EnquiryForms', id);

      if (existingEnquiry) {
        // Replace existing enquiry, preserving createdAt
        const enquiryRef = doc(db, 'Enquiries', existingEnquiry.id);
        const updatedData = {
          ...enquiryData,
          createdAt: existingEnquiry.createdAt || new Date(),
        };
        await updateDoc(enquiryRef, updatedData);
        console.log(`Replaced existing enquiry with ID: ${existingEnquiry.id}`);
      } else {
        // Create new enquiry
        await addDoc(collection(db, 'Enquiries'), enquiryData);
        console.log('Created new enquiry');
      }

      // Update enquiry count
      await updateDoc(formRef, {
        enquiryCount: increment(1),
      });

      alert('Enquiry submitted successfully!');
      // Reset form
      const initialFormData = {};
      formFields.forEach((field) => {
        if (field.defaultValue) {
          initialFormData[field.name] = field.defaultValue;
        }
      });
      setFormData(initialFormData);
    } catch (err) {
      console.error('Error submitting enquiry:', err);
      setError(`Error submitting enquiry: ${err.message}`);
    }
  };

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
          const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== '';

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
              ) : (
                <input
                  type={field.type || 'text'}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
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
      </form>
    </div>
  );
};

export default EnquiryFormPage;