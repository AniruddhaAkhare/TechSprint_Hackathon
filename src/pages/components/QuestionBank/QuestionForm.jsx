// QuestionForm.jsx
import React, { useState, useEffect } from 'react';

const QuestionForm = ({ onAddQuestion, initialData, questions }) => {
  const [formData, setFormData] = useState({
    question: '',
    type: 'mcq',
    subject: '',
    tags: [],
    options: ['', '', '', ''],
  });
  const [subjectSuggestions, setSubjectSuggestions] = useState([]);
  const [tagSuggestions, setTagSuggestions] = useState([]);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || '',
        type: initialData.type || 'mcq',
        subject: initialData.subject || '',
        tags: initialData.tags || [],
        options: initialData.options || ['', '', '', ''],
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (questions) {
      const subjects = [...new Set(questions.map(q => q.subject))].filter(Boolean);
      const allTags = questions.flatMap(q => q.tags || []);
      const uniqueTags = [...new Set(allTags)].filter(Boolean);
      setSubjectSuggestions(subjects);
      setTagSuggestions(uniqueTags);
    }
  }, [questions]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      question: formData.question,
      type: formData.type,
      subject: capitalizeFirstLetter(formData.subject),
      tags: formData.tags,
      ...(formData.type === 'mcq' && { 
        options: formData.options.filter(opt => opt.trim() !== '') 
      }),
    };
    onAddQuestion(questionData);
    if (!initialData) {
      setFormData({ 
        question: '', 
        type: 'mcq', 
        subject: '', 
        tags: [], 
        options: ['', '', '', ''] 
      });
      setCurrentTag('');
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const deleteOption = (index) => {
    if (formData.options.length > 1) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, subject: value });
    setShowSubjectDropdown(true);
  };

  const handleTagInput = (e) => {
    const value = e.target.value;
    setCurrentTag(capitalizeFirstLetter(value));
    setShowTagDropdown(true);
  };

  const addTag = (tag) => {
    const capitalizedTag = capitalizeFirstLetter(tag);
    if (tag && !formData.tags.includes(capitalizedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, capitalizedTag],
      }));
    }
    setCurrentTag('');
    setShowTagDropdown(false);
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const filteredSubjects = subjectSuggestions.filter(s => 
    s.toLowerCase().includes(formData.subject.toLowerCase())
  );
  const filteredTags = tagSuggestions.filter(t => 
    t.toLowerCase().includes(currentTag.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="overflow-y-auto h-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <input
          type="text"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          placeholder="Enter question"
          required
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="mcq">MCQ</option>
          <option value="short">Short Question</option>
          <option value="upload">Upload File</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
        <input
          type="text"
          value={formData.subject}
          onChange={handleSubjectChange}
          placeholder="Enter subject"
          required
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {showSubjectDropdown && formData.subject && filteredSubjects.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-auto shadow-lg">
            {filteredSubjects.map(subject => (
              <li
                key={subject}
                onClick={() => {
                  setFormData(prev => ({ ...prev, subject }));
                  setShowSubjectDropdown(false);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {subject}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
        <input
          type="text"
          value={currentTag}
          onChange={handleTagInput}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(currentTag))}
          placeholder="Enter tag and press Enter"
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {showTagDropdown && currentTag && filteredTags.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-40 overflow-auto shadow-lg">
            {filteredTags.map(tag => (
              <li
                key={tag}
                onClick={() => addTag(tag)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-2 flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {formData.type === 'mcq' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          {formData.options.map((option, index) => (
            <div key={index} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => deleteOption(index)}
                className="text-red-600 hover:text-red-800"
                disabled={formData.options.length <= 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Option
          </button>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white px-4 py-2.5 rounded-md hover:bg-indigo-700 transition-colors font-medium"
      >
        {initialData ? 'Update Question' : 'Add Question'}
      </button>
    </form>
  );
};

export default QuestionForm;