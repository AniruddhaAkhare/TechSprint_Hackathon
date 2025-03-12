import React, { useState } from 'react';
import { db } from '../../../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const CreateFeeTemplate = ({ onCancel }) => {
    const [templateName, setTemplateName] = useState('');
    const [fields, setFields] = useState([]);
    const [numOfInstallments, setNumOfInstallment] = useState('');

    const addField = () => {
        setFields([...fields, { fieldName: '', fieldType: '' }]);
    };

    const handleFieldChange = (index, key, value) => {
        const updatedFields = [...fields];
        updatedFields[index][key] = value;
        setFields(updatedFields);
    };

    const removeField = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        setFields(updatedFields);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const templateData = {
            templateName,
            fields,
        };

        try {
            const docRef = await addDoc(collection(db, 'feeTemplates'), templateData);
            console.log('Template saved with ID: ', docRef.id);
            alert('Template saved successfully!');
            resetForm();
            onCancel();
        } catch (error) {
            console.error('Error saving template: ', error);
            alert('Error saving template. Please try again.');
        }
    };

    const resetForm = () => {
        setTemplateName('');
        setFields([]);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-md w-1/3 max-h-[80vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Template Name:</label>
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Fields</h3>
                        {fields.map((field, index) => (
                            <div key={index} className="mb-4 p-4 border border-gray-200 rounded-lg">
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Field Name:</label>
                                        <input
                                            type="text"
                                            value={field.fieldName}
                                            onChange={(e) => handleFieldChange(index, 'fieldName', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700">Field Type:</label>
                                        <select
                                            value={field.fieldType}
                                            onChange={(e) => handleFieldChange(index, 'fieldType', e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        >
                                            <option value="" disabled>Select data type</option>
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="date">Date</option>
                                            <option value="boolean">Boolean</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => removeField(index)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addField}
                            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Add Field
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Number of installments:</label>
                        <select
                            value={numOfInstallments}
                            onChange={(e) => setNumOfInstallment(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="" disabled>Select</option>
                            <option value="number">2</option>
                            <option value="number">3</option>
                            <option value="number">4</option>
                            <option value="number">5</option>
                            <option value="number">6</option>
                            <option value="number">7</option>
                            <option value="number">8</option>
                            <option value="number">9</option>
                            <option value="number">10</option>                            
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Save Template
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="ml-2 w-full bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFeeTemplate;
