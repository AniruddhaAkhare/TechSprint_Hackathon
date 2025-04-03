import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase'; // Adjust path as needed
import { collection, addDoc, getDocs, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const QuestionTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({
    name: '',
    subject: '',
    type: '',
    selectedQuestions: [],
  });
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch templates and questions on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      const q = query(collection(db, 'templates'));
      const querySnapshot = await getDocs(q);
      const templatesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTemplates(templatesData);
    };

    const fetchQuestions = async () => {
      const q = query(collection(db, 'questions'));
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsData);
    };

    fetchTemplates();
    fetchQuestions();
  }, []);

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
      if (editingTemplate) {
        const templateRef = doc(db, 'templates', editingTemplate.id);
        await updateDoc(templateRef, templateData);
        setTemplates(templates.map(t => (t.id === editingTemplate.id ? { id: t.id, ...templateData } : t)));
        setEditingTemplate(null);
      } else {
        const docRef = await addDoc(collection(db, 'templates'), templateData);
        setTemplates([...templates, { id: docRef.id, ...templateData }]);
      }
      setIsDialogOpen(false);
      setTemplateData({ name: '', subject: '', type: '', selectedQuestions: [] });
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  // Edit existing template
  const editTemplate = (template) => {
    setEditingTemplate(template);
    setTemplateData(template);
    setIsDialogOpen(true);
  };

  // Delete template
  const deleteTemplate = async (id) => {
    try {
      await deleteDoc(doc(db, 'templates', id));
      setTemplates(templates.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSubject = filterSubject ? template.subject === filterSubject : true;
    const matchesType = filterType ? template.type === filterType : true;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesType && matchesSearch;
  });

  // Unique subjects for filter dropdown
  const uniqueSubjects = [...new Set(templates.map(t => t.subject).filter(Boolean))];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      {/* Header and Create Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Question Templates</h1>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setTemplateData({ name: '', subject: '', type: '', selectedQuestions: [] });
            setIsDialogOpen(true);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create Template
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full md:w-1/4 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          >
            <option value="">All Subjects</option>
            {uniqueSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-1/4 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          >
            <option value="">All Types</option>
            <option value="quiz">Quiz</option>
            <option value="feedback">Feedback</option>
            <option value="exam">Exam</option>
            <option value="assignment">Assignment</option>
          </select>

          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2.5 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Templates List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {filteredTemplates.length === 0 ? (
          <p className="text-gray-500 text-center">No templates available</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredTemplates.map(template => (
              <li key={template.id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-500">Subject: {template.subject} | Type: {template.type}</p>
                  <p className="text-sm text-gray-500">
                    Questions: {template.selectedQuestions.length}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => editTemplate(template)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Right-Side Dialog */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isDialogOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 bg-white h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </h2>
            <button
              onClick={() => setIsDialogOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Template Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Template Name</label>
              <input
                type="text"
                name="name"
                value={templateData.name}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter template name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                value={templateData.subject}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter subject"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                name="type"
                value={templateData.type}
                onChange={handleInputChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select type</option>
                <option value="quiz">Quiz</option>
                <option value="feedback">Feedback</option>
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>

            {/* Question Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Add Questions</h3>
              <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md p-2">
                {questions.length === 0 ? (
                  <p className="text-gray-500 text-center">No questions available</p>
                ) : (
                  questions.map(question => (
                    <div key={question.id} className="flex items-center gap-2 py-2">
                      <input
                        type="checkbox"
                        checked={templateData.selectedQuestions.includes(question.id)}
                        onChange={() => toggleQuestion(question.id)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 truncate">{question.question}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Selected Questions Preview */}
            {templateData.selectedQuestions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Questions</h3>
                <ul className="space-y-2">
                  {templateData.selectedQuestions.map(id => {
                    const question = questions.find(q => q.id === id);
                    return (
                      <li key={id} className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                        <span className="text-sm text-gray-700 truncate">{question?.question}</span>
                        <button
                          onClick={() => toggleQuestion(id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={saveTemplate}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              disabled={!templateData.name || !templateData.type}
            >
              {editingTemplate ? 'Update' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-60 z-40"
          onClick={() => setIsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default QuestionTemplate;