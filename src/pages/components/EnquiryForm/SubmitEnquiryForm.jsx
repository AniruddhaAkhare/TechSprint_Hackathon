
// import React, { useState, useEffect } from "react";
// import { db } from "../../../config/firebase";
// import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
// import { useParams } from "react-router-dom";
// import { serverTimestamp } from "firebase/firestore";
// import { allEnquiryFields } from "./enquiryFields.jsx";
// import QRCode from "react-qr-code";

// const SubmitEnquiryForm = () => {
//   const { formId } = useParams();
//   const [formData, setFormData] = useState(null);
//   const [formValues, setFormValues] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);

//   const formUrl = `https://shikshasaarathi.web.app/enquiry/${formId}`;

//   useEffect(() => {
//     const fetchForm = async () => {
//       try {
//         setLoading(true);
//         const formRef = doc(db, "enquiryForms", formId);
//         const formSnap = await getDoc(formRef);
//         if (!formSnap.exists()) {
//           setError("Form not found.");
//           return;
//         }
//         const data = formSnap.data();
//         setFormData(data);
//         const initialValues = {};
//         data.fields.forEach((field) => {
//           initialValues[field.id] = field.defaultValue || "";
//         });
//         setFormValues(initialValues);
//       } catch (err) {
//         setError("Failed to load form: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchForm();
//   }, [formId]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormValues((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData) {
//       setError("Form data not loaded.");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const enquiryData = {
//         formId: formId,
//         userData: formValues,
//         timestamp: serverTimestamp(),
//       };
//       await addDoc(collection(db, "enquiries"), enquiryData);

//       const formRef = doc(db, "enquiryForms", formId);
//       await updateDoc(formRef, {
//         enquiryCount: (formData.enquiryCount || 0) + 1,
//         updatedAt: serverTimestamp(),
//       });

//       setSuccess(true);
//       setFormValues({});
//     } catch (err) {
//       setError("Failed to submit enquiry: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div className="p-4">Loading...</div>;
//   if (error) return <div className="p-4 text-red-600">{error}</div>;
//   if (!formData) return null;

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">{formData.name}</h1>
//       <div className="mb-6">
//         <h2 className="text-lg font-medium mb-2">Share this Form</h2>
//         <div className="qr-code-container">
//           <QRCode value={formUrl} size={128} level="H" />
//         </div>
//         <p className="mt-2 text-sm text-gray-500">Scan to access the form</p>
//       </div>
//       {success && (
//         <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700">
//           Enquiry submitted successfully!
//         </div>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {formData.fields.map((field) => {
//           const fieldConfig = allEnquiryFields.find((f) => f.id === field.id);
//           if (!fieldConfig) return null;
//           const isDefaultEmpty = !field.defaultValue || field.defaultValue === "";
//           return (
//             <div key={field.id} className="mb-4">
//               <label className="block text-gray-700 text-sm font-medium mb-2">{fieldConfig.label}</label>
//               {fieldConfig.type === "textarea" ? (
//                 <textarea
//                   name={field.id}
//                   value={formValues[field.id] || ""}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder={isDefaultEmpty ? fieldConfig.label : ""}
//                   disabled={!isDefaultEmpty}
//                 />
//               ) : fieldConfig.type === "select" ? (
//                 <select
//                   name={field.id}
//                   value={formValues[field.id] || ""}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   disabled={!isDefaultEmpty}
//                 >
//                   <option value="">Select {fieldConfig.label}</option>
//                   {fieldConfig.options?.map((option) => (
//                     <option key={option} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               ) : (
//                 <input
//                   type={fieldConfig.type}
//                   name={field.id}
//                   value={formValues[field.id] || ""}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border rounded-md"
//                   placeholder={isDefaultEmpty ? fieldConfig.label : ""}
//                   disabled={!isDefaultEmpty}
//                 />
//               )}
//               {!isDefaultEmpty && <p className="mt-1 text-sm text-gray-500">Default: {field.defaultValue}</p>}
//             </div>
//           );
//         })}
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//           disabled={loading}
//         >
//           {loading ? "Submitting..." : "Submit"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SubmitEnquiryForm;


import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { doc, getDoc, collection, addDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";

const SubmitEnquiryForm = () => {
  const { formId } = useParams();
  const [formData, setFormData] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const formUrl = `https://enquiry-form-app-2025.web.app/enquiry/${formId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formUrl)}`;

  useEffect(() => {
    console.log("Form ID:", formId);
    console.log("QR Code URL:", qrCodeUrl);
    const fetchForm = async () => {
      try {
        setLoading(true);
        const formRef = doc(db, "enquiryForms", formId);
        const formSnap = await getDoc(formRef);
        if (!formSnap.exists()) {
          setError("Form not found.");
          console.error("Form not found in Firestore for ID:", formId);
          return;
        }
        const data = formSnap.data();
        setFormData(data);
        const initialValues = {};
        data.fields.forEach((field) => {
          initialValues[field.id] = field.defaultValue || "";
        });
        setFormValues(initialValues);
      } catch (err) {
        setError("Failed to load form: " + err.message);
        console.error("Error fetching form:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData) {
      setError("Form data not loaded.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const enquiryData = {
        formId: formId,
        userData: formValues,
        timestamp: serverTimestamp(),
      };
      await addDoc(collection(db, "enquiries"), enquiryData);

      const formRef = doc(db, "enquiryForms", formId);
      await updateDoc(formRef, {
        enquiryCount: (formData.enquiryCount || 0) + 1,
        updatedAt: serverTimestamp(),
      });

      setSuccess(true);
      setFormValues({});
    } catch (err) {
      setError("Failed to submit enquiry: " + err.message);
      console.error("Error submitting enquiry:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!formData) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{formData.name}</h1>
      <div className="mb-6">
        <h2 className="text-lg font-medium mb-2">Share this Form</h2>
        <div className="qr-code-container">
          <img src={qrCodeUrl} alt="QR Code" />
        </div>
        <p className="mt-2 text-sm text-gray-500">Scan to access the form</p>
        <p className="mt-2 text-sm text-gray-500">
          Form URL: <a href={formUrl} target="_blank" rel="noopener noreferrer">{formUrl}</a>
        </p>
      </div>
      {success && (
        <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700">
          Enquiry submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {formData.fields.map((field) => {
          const fieldConfig = allEnquiryFields.find((f) => f.id === field.id);
          if (!fieldConfig) return null;
          const isDefaultEmpty = !field.defaultValue || field.defaultValue === "";
          return (
            <div key={field.id} className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">{fieldConfig.label}</label>
              {fieldConfig.type === "textarea" ? (
                <textarea
                  name={field.id}
                  value={formValues[field.id] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={isDefaultEmpty ? fieldConfig.label : ""}
                  disabled={!isDefaultEmpty}
                />
              ) : fieldConfig.type === "select" ? (
                <select
                  name={field.id}
                  value={formValues[field.id] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={!isDefaultEmpty}
                >
                  <option value="">Select {fieldConfig.label}</option>
                  {fieldConfig.options?.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={fieldConfig.type}
                  name={field.id}
                  value={formValues[field.id] || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder={isDefaultEmpty ? fieldConfig.label : ""}
                  disabled={!isDefaultEmpty}
                />
              )}
              {!isDefaultEmpty && <p className="mt-1 text-sm text-gray-500">Default: {field.defaultValue}</p>}
            </div>
          );
        })}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SubmitEnquiryForm;