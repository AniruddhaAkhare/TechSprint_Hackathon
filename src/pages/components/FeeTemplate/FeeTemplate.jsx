// import React, { useEffect, useState } from 'react';
// import { db } from '../../../config/firebase';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import CreateFeeTemplate from './CreateFeeTemplate';

// const FeeTemplate = () => {
//     const [templates, setTemplates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [selectedTemplates, setSelectedTemplates] = useState(new Set());
//     const [showCreateTemplate, setShowCreateTemplate] = useState(false); 

//     useEffect(() => {
//         const fetchTemplates = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, 'feeTemplates'));
//                 const templatesData = querySnapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setTemplates(templatesData);
//             } catch (error) {
//                 console.error('Error fetching templates: ', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTemplates();
//     }, []);

//     const handleSelectTemplate = (id) => {
//         const updatedSelectedTemplates = new Set(selectedTemplates);
//         if (updatedSelectedTemplates.has(id)) {
//             updatedSelectedTemplates.delete(id);
//         } else {
//             updatedSelectedTemplates.add(id);
//         }
//         setSelectedTemplates(updatedSelectedTemplates);
//     };

//     const handleDeleteSelectedTemplates = async () => {
//         const promises = Array.from(selectedTemplates).map(async (id) => {
//             try {
//                 await deleteDoc(doc(db, 'feeTemplates', id));
//             } catch (error) {
//                 console.error('Error deleting template: ', error);
//             }
//         });

//         await Promise.all(promises);
//         setTemplates(templates.filter(template => !selectedTemplates.has(template.id)));
//         setSelectedTemplates(new Set());
//     };

//     const toggleCreateTemplate = () => {
//         setShowCreateTemplate(!showCreateTemplate);
//     };

//     if (loading) {
//         return <p className="text-center text-gray-600">Loading...</p>;
//     }
  
//     return (
//         <div className="w-screen p-4 bg-gray-100 ml-80">
//             <h2 className="text-2xl font-bold mb-6">Fee Templates</h2>
//             <button
//                 onClick={handleDeleteSelectedTemplates}
//                 className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
//                 disabled={selectedTemplates.size === 0}
//             >
//                 Delete
//             </button>
//             <button
//                 onClick={toggleCreateTemplate}
//                 className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             >
//                 Create Template
//             </button>

//             {showCreateTemplate && <CreateFeeTemplate onCancel={toggleCreateTemplate} />}

//             <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left">
//                                 <input
//                                     type="checkbox"
//                                     onChange={(e) => {
//                                         const isChecked = e.target.checked;
//                                         setSelectedTemplates(isChecked ? new Set(templates.map((template) => template.id)) : new Set());
//                                     }}
//                                     checked={selectedTemplates.size === templates.length && templates.length > 0}
//                                 />
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {templates.map((template) => (
//                             <tr key={template.id}>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <input
//                                         type="checkbox"
//                                         checked={selectedTemplates.has(template.id)}
//                                         onChange={() => handleSelectTemplate(template.id)}
//                                     />
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.templateName}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     <ul className="space-y-2">
//                                         {template.fields.map((field, index) => (
//                                             <li key={index} className="flex gap-4">
//                                                 <span className="font-semibold">{field.fieldName}</span>
//                                                 <span className="text-gray-600">({field.fieldType})</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default FeeTemplate;


// import React, { useEffect, useState } from 'react';
// import { db } from '../../../config/firebase';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import CreateFeeTemplate from './CreateFeeTemplate';
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input } from "@material-tailwind/react";


// const FeeTemplate = () => {
//     const [templates, setTemplates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showCreateTemplate, setShowCreateTemplate] = useState(false); 
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     useEffect(() => {
//         const fetchTemplates = async () => {
//             try {
//                 const querySnapshot = await getDocs(collection(db, 'feeTemplates'));
//                 const templatesData = querySnapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setTemplates(templatesData);
//             } catch (error) {
//                 console.error('Error fetching templates: ', error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchTemplates();
//     }, []);

//     const handleDeleteTemplate = async (id) => {
//         try {
//             await deleteDoc(doc(db, 'feeTemplates', id));
//             setTemplates(templates.filter(template => template.id !== id));
//         } catch (error) {
//             console.error('Error deleting template: ', error);
//         }
//     };

//     const toggleCreateTemplate = () => {
//         setShowCreateTemplate(!showCreateTemplate);
//     };

//     if (loading) {
//         return <p className="text-center text-gray-600">Loading...</p>;
//     }
  
//     return (
//         <div className="w-screen p-4 bg-gray-100 ml-80">
//             <h2 className="text-2xl font-bold mb-6">Fee Templates</h2>
            
//             <button
//                 onClick={toggleCreateTemplate}
//                 className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//             >
//                 Create Template
//             </button>

//             {showCreateTemplate && <CreateFeeTemplate onCancel={toggleCreateTemplate} />}

//             <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
//                 <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
//                             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                         {templates.map((template) => (
//                             <tr key={template.id}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.templateName}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     <ul className="space-y-2">
//                                         {template.fields.map((field, index) => (
//                                             <li key={index} className="flex gap-4">
//                                                 <span className="font-semibold">{field.fieldName}</span>
//                                                 <span className="text-gray-600">({field.fieldType})</span>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </td>
//                                 <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                                     <DialogHeader>Confirm Deletion</DialogHeader>
//                                     <DialogBody>Are you sure you want to delete this instructor? This action cannot be undone.</DialogBody>
//                                     <DialogFooter>
//                                         <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                                         <Button variant="filled" color="red" onClick={handleDeleteTemplate}>Yes, Delete</Button>
//                                     </DialogFooter>
//                                 </Dialog>

//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                     <button
//                                         onClick={() => handleDeleteTemplate(template.id)}
//                                         className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
//                                     >
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default FeeTemplate;


import React, { useEffect, useState } from 'react';
import { db } from '../../../config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import CreateFeeTemplate from './CreateFeeTemplate';
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

const FeeTemplate = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateTemplate, setShowCreateTemplate] = useState(false); 
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'feeTemplates'));
                const templatesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTemplates(templatesData);
            } catch (error) {
                console.error('Error fetching templates: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplates();
    }, []);

    const handleDeleteTemplate = async () => {
        if (!deleteId) return;
        try {
            await deleteDoc(doc(db, 'feeTemplates', deleteId));
            setTemplates(templates.filter(template => template.id !== deleteId));
            setOpenDelete(false);
            setDeleteId(null);
        } catch (error) {
            console.error('Error deleting template: ', error);
        }
    };

    const toggleCreateTemplate = () => {
        setShowCreateTemplate(!showCreateTemplate);
    };

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }
  
    return (
        <div className="w-screen p-4 bg-gray-100 ml-80">
            <h2 className="text-2xl font-bold mb-6">Fee Templates</h2>
            
            <button
                onClick={toggleCreateTemplate}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                Create Template
            </button>

            {showCreateTemplate && <CreateFeeTemplate onCancel={toggleCreateTemplate} />}

            <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Template Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fields</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {templates.map((template) => (
                            <tr key={template.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.templateName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <ul className="space-y-2">
                                        {template.fields.map((field, index) => (
                                            <li key={index} className="flex gap-4">
                                                <span className="font-semibold">{field.fieldName}</span>
                                                <span className="text-gray-600">({field.fieldType})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            setDeleteId(template.id);
                                            setOpenDelete(true);
                                        }}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
                <DialogHeader>Confirm Deletion</DialogHeader>
                <DialogBody>Are you sure you want to delete this template? This action cannot be undone.</DialogBody>
                <DialogFooter>
                    <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button variant="filled" color="red" onClick={handleDeleteTemplate}>Yes, Delete</Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default FeeTemplate;
