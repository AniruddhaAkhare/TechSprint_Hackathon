import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../src/config/firebase.js"
import { doc, getDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { allEnquiryFields } from "../src/pages/components/EnquiryForm/enquiryFields.jsx";
import { Button, Input } from "@material-tailwind/react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const UniqueEnquiryForm = () => {
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

export default UniqueEnquiryForm;