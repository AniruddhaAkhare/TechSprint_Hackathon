import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../context/AuthContext';

const QuestionTemplate = () => {
    const { user, rolePermissions } = useAuth();

    const canCreate = rolePermissions.templates?.create || false;
    const canUpdate = rolePermissions.templates?.update || false;
    const canDelete = rolePermissions.templates?.delete || false;
    const canDisplay = rolePermissions.templates?.display || false;

    const [templates, setTemplates] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateData, setTemplateData] = useState({
        name: '',
        subject: '',
        selectedQuestions: [],
    });
    const [filterSubject, setFilterSubject] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTemplates, setSelectedTemplates] = useState([]);

    // Fetch templates and questions on mount
    useEffect(() => {
        const fetchTemplates = async () => {
            try {
                const q = query(collection(db, 'templates'));
                const querySnapshot = await getDocs(q);
                const templatesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setTemplates(templatesData);
            } catch (error) {
                //console.error('Error fetching templates:', error);
            }
        };

        const fetchQuestions = async () => {
            try {
                const q = query(collection(db, 'questions'));
                const querySnapshot = await getDocs(q);
                const questionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setQuestions(questionsData);
            } catch (error) {
                //console.error('Error fetching questions:', error);
            }
        };

        fetchTemplates();
        fetchQuestions();
    }, []);

    // Log Activity Function
    const logActivity = async (action, details) => {
        try {
            await addDoc(collection(db, 'activityLogs'), {
                action,
                details: {
                    ...details,
                    
                },
                userId: user.uid,
                userEmail: user.email,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            //console.error('Error logging activity:', error);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTemplateData(prev => ({ ...prev, [name]: value }));
    };

    // Add or remove questions from the template
    const toggleQuestion = (questionId) => {
        setTemplateData(prev => {
            const isSelected = prev.selectedQuestions.includes(questionId);
            if (isSelected) {
                return { ...prev, selectedQuestions: prev.selectedQuestions.filter(id => id !== questionId) };
            } else {
                return { ...prev, selectedQuestions: [...prev.selectedQuestions, questionId] };
            }
        });
    };

    // Save template (create or update)
    const saveTemplate = async () => {
        try {
            if (editingTemplate && canUpdate) {
                const templateRef = doc(db, 'templates', editingTemplate.id);
                await updateDoc(templateRef, templateData);
                setTemplates(templates.map(t => (t.id === editingTemplate.id ? { id: t.id, ...templateData } : t)));
                // Log update activity
                await logActivity('Updated template', {
                    templateId: editingTemplate.id,
                    name: templateData.name,
                    oldName: editingTemplate.name,
                    oldSubject: editingTemplate.subject,
                    newSubject: templateData.subject,
                    oldQuestionCount: editingTemplate.selectedQuestions.length,
                    newQuestionCount: templateData.selectedQuestions.length,
                });
                alert('Template updated successfully!');
                setEditingTemplate(null);
            } else if (canCreate) {
                const docRef = await addDoc(collection(db, 'templates'), templateData);
                setTemplates([...templates, { id: docRef.id, ...templateData }]);
                // Log create activity
                await logActivity('Created template', {
                    templateId: docRef.id,
                    name: templateData.name,
                    subject: templateData.subject,
                    questionCount: templateData.selectedQuestions.length,
                });
                alert('Template created successfully!');
            }
            setIsDialogOpen(false);
            setTemplateData({ name: '', subject: '', selectedQuestions: [] });
        } catch (error) {
            //console.error('Error saving template:', error);
            alert('Failed to save template. Please try again.');
        }
    };

    // Edit existing template
    const editTemplate = (template) => {
        if (!canUpdate) return;
        setEditingTemplate(template);
        setTemplateData(template);
        setIsDialogOpen(true);
    };

    // Delete single template
    const deleteTemplate = async (id) => {
        if (!canDelete) return;
        try {
            const templateToDelete = templates.find(t => t.id === id);
            await deleteDoc(doc(db, 'templates', id));
            setTemplates(templates.filter(t => t.id !== id));
            setSelectedTemplates(selectedTemplates.filter(selectedId => selectedId !== id));
            // Log delete activity
            await logActivity('Deleted template', {
                templateId: id,
                name: templateToDelete?.name || 'Unknown',
                subject: templateToDelete?.subject,
                questionCount: templateToDelete?.selectedQuestions.length,
            });
            alert('Template deleted successfully!');
        } catch (error) {
            //console.error('Error deleting template:', error);
            alert('Failed to delete template. Please try again.');
        }
    };

    // Delete multiple templates
    const deleteMultipleTemplates = async () => {
        if (!canDelete || selectedTemplates.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedTemplates.length} template(s)?`)) return;

        try {
            const templatesToDelete = templates.filter(t => selectedTemplates.includes(t.id));
            await Promise.all(selectedTemplates.map(id => deleteDoc(doc(db, 'templates', id))));
            setTemplates(templates.filter(t => !selectedTemplates.includes(t.id)));
            // Log bulk delete activity
            await logActivity('Deleted multiple templates', {
                templateIds: selectedTemplates,
                count: selectedTemplates.length,
                templates: templatesToDelete.map(t => ({
                    id: t.id,
                    name: t.name,
                    subject: t.subject,
                    questionCount: t.selectedQuestions.length,
                })),
            });
            setSelectedTemplates([]);
            alert(`${selectedTemplates.length} template(s) deleted successfully!`);
        } catch (error) {
            //console.error('Error deleting multiple templates:', error);
            alert('Failed to delete some templates. Please try again.');
        }
    };

    // Handle template selection
    const handleSelectTemplate = (id) => {
        setSelectedTemplates(prev => 
            prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
        );
    };

    // Handle select all
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedTemplates(filteredTemplates.map(t => t.id));
        } else {
            setSelectedTemplates([]);
        }
    };

    // Filter templates
    const filteredTemplates = templates.filter(template => {
        const matchesSubject = filterSubject ? template.subject === filterSubject : true;
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSubject && matchesSearch;
    });

    // Unique subjects from questions for dropdowns
    const uniqueSubjects = [...new Set(questions.map(q => q.subject).filter(Boolean))];

    if (!canDisplay) {
        return (
            <div className="p-6 bg-gray-100 min-h-screen text-center py-8 text-gray-500">
                You don't have permission to view templates.
            </div>
        );
    }

    return (
       <div className="bg-gray-100 min-h-screen p-4 fixed inset-0 left-[300px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-[#333333] font-sans">Question Templates</h1>
                <div className="flex gap-4">
                    {canDelete && selectedTemplates.length > 0 && (
                        <button
                            onClick={deleteMultipleTemplates}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H7V5a2 2 0 012-2z" />
                            </svg>
                            Delete Selected ({selectedTemplates.length})
                        </button>
                    )}
                    {canCreate && (
                        <button
                            onClick={() => {
                                setEditingTemplate(null);
                                setTemplateData({ name: '', subject: '', selectedQuestions: [] });
                                setIsDialogOpen(true);
                            }}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Create Template
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <select
                        value={filterSubject}
                        onChange={(e) => setFilterSubject(e.target.value)}
                        className="w-full md:w-1/4 p-2.5 border border-gray-300 rounded-md"
                    >
                        <option value="">All Subjects</option>
                        {uniqueSubjects.map(subject => (
                            <option key={subject} value={subject}>{subject}</option>
                        ))}
                    </select>
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Search templates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2.5 pl-10 border border-gray-300 rounded-md"
                        />
                        <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Templates List */}
       <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
  {filteredTemplates.length === 0 ? (
    <p className="text-gray-400 italic text-center py-10">No templates available</p>
  ) : (
    <>
      <div className="flex items-center border-b border-gray-200 pb-3 mb-4">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedTemplates.length === filteredTemplates.length}
          className="mr-4 h-6 w-6 text-indigo-600 rounded-md focus:ring-indigo-500 focus:ring-2"
        />
        <span className="text-gray-800 font-semibold text-lg select-none">Select All</span>
      </div>
      <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredTemplates.map(template => (
          <li
            key={template.id}
            className="py-4 flex items-center hover:bg-indigo-50 rounded-lg transition-colors duration-200"
          >
            <input
              type="checkbox"
              checked={selectedTemplates.includes(template.id)}
              onChange={() => handleSelectTemplate(template.id)}
              className="mr-5 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 focus:ring-2"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{template.name}</h3>
              <p className="text-sm text-gray-600 truncate">Subject: {template.subject}</p>
              <p className="text-sm text-gray-600">Questions: {template.selectedQuestions.length}</p>
            </div>
            <div className="flex space-x-3 ml-6">
              {canUpdate && (
                <button
                  onClick={() => editTemplate(template)}
                  className="px-4 py-1 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                  aria-label={`Edit ${template.name}`}
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => deleteTemplate(template.id)}
                  className="px-4 py-1 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition"
                  aria-label={`Delete ${template.name}`}
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )}
</div>


            {/* Side Dialog */}
            <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${isDialogOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">{editingTemplate ? 'Edit Template' : 'Create New Template'}</h2>
                        <button onClick={() => setIsDialogOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Template Form */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Template Name <span className="text-red-500">*</span></label>
                            <input
                                name="name"
                                value={templateData.name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                placeholder="Enter template name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject <span className="text-red-500">*</span></label>
                            <select
                                name="subject"
                                value={templateData.subject}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                required
                            >
                                <option value="">Select subject</option>
                                {uniqueSubjects.map(subject => (
                                    <option key={subject} value={subject}>{subject}</option>
                                ))}
                            </select>
                        </div>

                        {/* Question List */}
                        <div>
                            <h3 className="text-lg font-medium mb-2">Add Questions</h3>
                            <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
                                {questions.filter(q => !templateData.subject || q.subject === templateData.subject).map(question => (
                                    <div key={question.id} className="flex items-center gap-2 py-2">
                                        <input
                                            type="checkbox"
                                            checked={templateData.selectedQuestions.includes(question.id)}
                                            onChange={() => toggleQuestion(question.id)}
                                            className="h-4 w-4 text-indigo-600"
                                        />
                                        <span className="text-sm text-gray-700 truncate">{question.question}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        {templateData.selectedQuestions.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium mb-2">Selected Questions</h3>
                                <ul className="space-y-2">
                                    {templateData.selectedQuestions.map(id => {
                                        const question = questions.find(q => q.id === id);
                                        return (
                                            <li key={id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                                                <span className="text-sm text-gray-700 truncate">{question?.question || 'Unknown'}</span>
                                                <button onClick={() => toggleQuestion(id)} className="text-red-600 text-sm">Remove</button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">Cancel</button>
                        <button onClick={saveTemplate} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionTemplate;