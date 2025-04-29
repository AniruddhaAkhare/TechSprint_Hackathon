import React from 'react';

const FormViewer = ({ form, onClose }) => {
  const fieldTypes = {
    text: ({ field }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {field.label}
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md"
          placeholder={field.label}
        />
      </div>
    ),
    select: ({ field }) => (
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-medium mb-2">
          {field.label}
        </label>
        <select className="w-full px-3 py-2 border rounded-md">
          <option value="">Select {field.label}</option>
        </select>
      </div>
    ),
    // Add other field types as needed
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
        
        <div className="space-y-4">
          {form.fields?.map((fieldId) => {
            const field = allEnquiryFields.find(f => f.id === fieldId);
            if (!field) return null;
            
            const FieldComponent = fieldTypes[field.type] || fieldTypes.text;
            return <FieldComponent key={field.id} field={field} />;
          })}
        </div>
      </div>
    </div>
  );
};