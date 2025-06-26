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
        setLoading(true);
        setError(null);
  
        // Fetch form data
        const docRef = doc(db, "enquiryForms", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          // //console.error("Form not found for ID:", id);
          setError("Form not found");
          return;
        }
  
        const data = docSnap.data();
        setFormTitle(data.name || "Enquiry Form");
  
        // Fetch instituteSetup document ID dynamically
        const instituteSetupSnapshot = await getDocs(collection(db, "instituteSetup"));
        if (instituteSetupSnapshot.empty) {
          console.warn("No documents found in instituteSetup collection");
        } else {
        }
        const instituteSetupDocId = instituteSetupSnapshot.docs[0]?.id;
  
        // Fetch dynamic options concurrently
        const [courseSnapshot, centerSnapshot, roleSnapshot, userSnapshot] = await Promise.all([
          getDocs(collection(db, "Course")).catch(err => {
            // //console.error("Error fetching Courses:", err);
            return { docs: [] };
          }),
          instituteSetupDocId
            ? getDocs(collection(db, "Branch")).catch(err => {
                // //console.error(`Error fetching Center for instituteSetup/${instituteSetupDocId}:`, err);
                return { docs: [] };
              })
            : Promise.resolve({ docs: [] }),
          getDocs(query(collection(db, "roles"), where("name", "==", "Sales"))).catch(err => {
            // //console.error("Error fetching Sales role:", err);
            return { docs: [] };
          }),
          getDocs(collection(db, "Users")).catch(err => {
            // //console.error("Error fetching Users:", err);
            return { docs: [] };
          }),
        ]);
  
        // Process Course options
        const courseOptions = courseSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: data.name || doc.id,
            label: data.name || doc.id,
          };
        });
  
        // Process Branch (Center) options
        const branchOptions = centerSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            value: data.name || doc.id,
            label: data.name || doc.id,
          };
        });
  
        // Process Assign To options (Users with Sales role)
        const salesRoleId = roleSnapshot.docs[0]?.id;
        if (roleSnapshot.empty) {
          console.warn("No Sales role found");
        } else {
        }
        const assignToOptions = userSnapshot.docs
          .filter((doc) => {
            const userData = doc.data();
            return userData.role === salesRoleId;
          })
          .map((doc) => {
            const data = doc.data();
            return {
              value: data.displayName || data.email || doc.id,
              label: data.displayName || data.email || doc.id,
            };
          });
  
        // Enrich fields with dynamic options
        const fields = data.fields || [];
        const enrichedFields = fields.map((field) => {
          const fieldConfig = allEnquiryFields
            .flatMap((category) => category.fields)
            .find((f) => f.id === field.id);
          let options = [];
          if (field.useDynamicOptions === false && field.customOptions?.length > 0) {
            // Use custom options if useDynamicOptions is false
            options = field.customOptions.map((opt) => ({
              value: opt,
              label: opt,
            }));
          } else {
            // Use dynamic or default options
            options = field.options || fieldConfig?.options || [];
            if (field.id === "course") {
              options = courseOptions;
            } else if (field.id === "branch") {
              options = branchOptions;
            } else if (field.id === "assignTo") {
              options = assignToOptions;
            }
          }
          return {
            ...field,
            name: field.id,
            type: fieldConfig?.type || "text",
            label: fieldConfig?.label || field.id,
            options,
            required: fieldConfig?.required || false,
          };
        });
        // const enrichedFields = fields.map((field) => {
        //   const fieldConfig = allEnquiryFields
        //     .flatMap((category) => category.fields)
        //     .find((f) => f.id === field.id);
        //   let options = field.options || fieldConfig?.options || [];
        //   if (field.id === "course") {
        //     options = courseOptions;
        //   } else if (field.id === "branch") {
        //     options = branchOptions;
        //   } else if (field.id === "assignTo") {
        //     options = assignToOptions;
        //   }
        //   return {
        //     ...field,
        //     name: field.id,
        //     type: fieldConfig?.type || "text",
        //     label: fieldConfig?.label || field.id,
        //     options,
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
      } catch (err) {
        // //console.error("Error fetching form or options:", {
        //   message: err.message,
        //   code: err.code,
        //   stack: err.stack,
        // });
        setError(`Error fetching form: ${err.message}`);
      } finally {
        setLoading(false);
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
  
      if (queries.length > 0) {
        const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
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



  if (error) {
    return (
      <div className="p-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  return (
<div className="p-6 max-w-xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
  <h2 className="text-3xl font-bold text-gray-800 font-sans tracking-tight mb-6">{formTitle}</h2>
  <form onSubmit={handleSubmit}>
    {formFields.map((field, index) => {
      const hasDefaultValue = field.defaultValue && field.defaultValue.trim() !== "";
      return (
        <div key={index} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {hasDefaultValue ? (
            <p className="border border-gray-200 p-3 w-full bg-gray-50 text-gray-600 rounded-lg shadow-inner">
              {field.defaultValue}
            </p>
          ) : field.type === "select" ? (
            <div className="relative">
              <select
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(e, field.name)}
                className="appearance-none border border-gray-200 p-3 w-full rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner"
                required={field.required}
              >
                <option value="">Select {field.label}</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ) : field.type === "textarea" ? (
            <textarea
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(e, field.name)}
              placeholder={field.placeholder || field.label}
              className="border border-gray-200 p-3 w-full rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner"
              required={field.required}
              rows={4}
            />
          ) : (
            <input
              type={field.type || "text"}
              placeholder={field.placeholder || field.label}
              value={formData[field.name] || ""}
              onChange={(e) => handleChange(e, field.name)}
              className="border border-gray-200 p-3 w-full rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-inner"
              required={field.required}
            />
          )}
        </div>
      );
    })}
    {error && <p className="text-red-500 text-sm mb-6 font-medium">{error}</p>}
    <button
      type="submit"
      className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 font-medium shadow-md w-full"
    >
      Submit
    </button>

    {showPrompt && (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center transition-opacity duration-300">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100/50 backdrop-blur-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">Duplicate Enquiry Detected</h3>
          <p className="text-sm text-gray-600 mb-5 leading-relaxed">
            An enquiry with the {formData.email ? "email" : "phone"} "{formData.email || formData.phone}" already exists:
          </p>
          <div className="mb-5 p-4 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
            <p className="text-sm"><strong className="text-gray-700">Name:</strong> {existingEnquiry?.name || "N/A"}</p>
            <p className="text-sm"><strong className="text-gray-700">Email:</strong> {existingEnquiry?.email || "N/A"}</p>
            <p className="text-sm"><strong className="text-gray-700">Phone:</strong> {existingEnquiry?.phone || "N/A"}</p>
            <p className="text-sm"><strong className="text-gray-700">Stage:</strong> {existingEnquiry?.stage || "N/A"}</p>
            <p className="text-sm"><strong className="text-gray-700">Created At:</strong> {existingEnquiry?.createdAt || "N/A"}</p>
          </div>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Do you want to keep the previous enquiry or update it with this new one?
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handlePromptResponse(true)}
              className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm"
            >
              Keep Previous
            </button>
            <button
              onClick={() => handlePromptResponse(false)}
              className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    )}
  </form>
</div>
  );
};

export default EnquiryFormPage;



