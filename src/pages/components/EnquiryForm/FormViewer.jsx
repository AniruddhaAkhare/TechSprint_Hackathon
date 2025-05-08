

import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { allEnquiryFields } from "./enquiryFields.jsx";

const FormViewer = ({ form, onClose }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(form.qrCodeUrl || null);
  const formUrl = `https://form-shikshasaarathi-com.web.app/${form.id}`;
  const generatedQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(formUrl)}`;

  useEffect(() => {
    if (!form.qrCodeUrl && form.id) {
      setQrCodeUrl(generatedQrCodeUrl);
      updateDoc(doc(db, "enquiryForms", form.id), { qrCodeUrl: generatedQrCodeUrl })
        .catch((err) => console.error("Error updating qrCodeUrl:", err));
    }
  }, [form.id, form.qrCodeUrl, generatedQrCodeUrl]);

  const fieldTypes = {
    text: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    email: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    tel: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <input
          type="tel"
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    number: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    date: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <input
          type="date"
          className="w-full px-3 py-2 border rounded-md"
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    textarea: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
          defaultValue={defaultValue || ""}
          readOnly
        />
      </div>
    ),
    select: ({ field, defaultValue }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">{field.label}</label>
        <select
          className="w-full px-3 py-2 border rounded-md"
          defaultValue={defaultValue || ""}
          disabled
        >
          <option value="">Select {field.label}</option>
          {field.options ? (
            field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))
          ) : (
            <>
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </>
          )}
        </select>
      </div>
    ),
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold">{form.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {qrCodeUrl && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
            <p className="font-medium">QR Code for Form Submission</p>
            <img src={qrCodeUrl} alt="Form QR Code" className="mt-2 max-w-xs mx-auto qr-code-image" />
            <div className="mt-2 flex space-x-2 justify-center">
              <a
                href={qrCodeUrl}
                download={`${form.name || "enquiry-form"}-qrcode.png`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Download QR Code
              </a>
              <button
  onClick={() => {
    navigator.clipboard.writeText(formUrl)
      .then(() => alert('Form URL copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  }}
  className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
>
  Copy Form URL
</button>
              {/* <button
                onClick={() => navigator.clipboard.write(formUrl)}
                className="inline-block bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Copy Form URL
              </button> */}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {form.fields?.length > 0 ? (
            form.fields.map((field) => {
              const fieldConfig = allEnquiryFields.find((f) => f.id === field.id);
              if (!fieldConfig) {
                console.warn(`Field with ID ${field.id} not found`);
                return null;
              }
              const FieldComponent = fieldTypes[fieldConfig.type] || fieldTypes.text;
              return (
                <FieldComponent
                  key={field.id}
                  field={fieldConfig}
                  defaultValue={field.defaultValue}
                />
              );
            })
          ) : (
            <p className="text-gray-600">No fields available for this form.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormViewer;