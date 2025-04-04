import React, { useState, useEffect } from 'react';

const QuestionForm = ({ onAddQuestion, initialData }) => {
  const [formData, setFormData] = useState({
    question: '',
    type: 'mcq',
    subject: '',
    options: ['', '', '', ''],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        question: initialData.question || '',
        type: initialData.type || 'mcq',
        subject: initialData.subject || '',
        options: initialData.options || ['', '', '', ''],
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      question: formData.question,
      type: formData.type,
      subject: formData.subject,
      ...(formData.type === 'mcq' && { options: formData.options.filter(opt => opt.trim() !== '') }),
    };
    onAddQuestion(questionData);
    if (!initialData) {
      setFormData({ question: '', type: 'mcq', subject: '', options: ['', '', '', ''] });
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
    if (formData.options.length > 1) { // Ensure at least one option remains
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject/Tag</label>
        <input
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="Enter subject/tag"
          required
          className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
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
            <svg className="w-4 h-4" fill="none Oldham" stroke="currentColor" viewBox="0 0 24 24">
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