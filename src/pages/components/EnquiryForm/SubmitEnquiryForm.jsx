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
  const [dynamicOptions, setDynamicOptions] = useState({
    course: [],
    branch: [],
    assignTo: [],
  });

  useEffect(() => {
    const fetchFormAndOptions = async () => {
      try {
        setLoading(true);
        setSubmitError(null);

        // Fetch form data
        const formRef = doc(db, "enquiryForms", formId);
        const formSnap = await getDoc(formRef);
        if (!formSnap.exists()) {
          // //console.error("Form not found for ID:", formId);
          setSubmitError("Form not found");
          return;
        }

        const data = formSnap.data();

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

        setDynamicOptions({
          course: courseOptions,
          branch: branchOptions,
          assignTo: assignToOptions,
        });

        // Enrich fields with dynamic options
        const enrichedFields = data.fields.map((field) => {
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
        // const enrichedFields = data.fields.map((field) => {
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

        setFormData({ ...data, fields: enrichedFields });

        // Initialize form values with default values
        const initialValues = {};
        enrichedFields.forEach((field) => {
          initialValues[field.id] = field.defaultValue || "";
        });
        setFormValues(initialValues);
      } catch (err) {
        
        setSubmitError(`Error fetching form: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchFormAndOptions();
  }, [formId]);

  // Rest of the component (handleChange, validateForm, handleSubmit, etc.) remains unchanged
  // For brevity, only the modified useEffect is shown
  // Include the original rendering logic and other functions as provided previously

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
          } else if (
            ["sscPercentage", "hscPercentage", "graduationPercentage", "postGraduationPercentage"].includes(fieldDef.id) &&
            !/^\d{1,2}$/.test(formValues[field.id])
          ) {
            newErrors[field.id] = `${fieldDef.label} must be a whole number between 0 and 100`;
          }
        }
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

      // If no existing enquiry, proceed to create a new one
      await createNewEnquiry();
    } catch (err) {
      // //console.error("Submission error:", err);
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
    setErrors({});
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
                      {loading ? (
                        <MenuItem value="" disabled>
                          Loading options...
                        </MenuItem>
                      ) : field.options?.length > 0 ? (
                        field.options.map((option) => (
                          <MenuItem key={option.value || option} value={option.value || option}>
                            {option.label || option}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="" disabled>
                          No options available
                        </MenuItem>
                      )}
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
                      className={`w-full px-3 py-2 border ${isError ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${isDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      disabled={loading || isDisabled}
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
      </div>
    </div>
  );
};

export default SubmitEnquiryForm;