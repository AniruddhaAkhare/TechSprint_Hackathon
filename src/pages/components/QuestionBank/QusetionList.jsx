import React from 'react';

const QuestionList = ({ questions, onEdit, onDelete, onSelect, selectedQuestions, onSelectAll }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {questions.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No questions found</p>
      ) : (
        <>
          <div className="p-4 border-b border-gray-200 flex items-center">
            <input
              type="checkbox"
              onChange={onSelectAll}
              checked={selectedQuestions.length === questions.length && questions.length > 0}
              className="mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-gray-700 font-medium">Select All</span>
          </div>
          {questions.map((question, index) => (
            <div
              key={question.id}
              className={`p-6 ${
                index !== questions.length - 1 ? 'border-b border-gray-200' : ''
              } hover:bg-gray-50 transition-colors flex items-start`}
            >
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.id)}
                onChange={() => onSelect(question.id)}
                className="mt-1 mr-4 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <div className="flex-1">
                <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                <div className="flex gap-4 text-sm text-gray-600 mb-2">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {question.type}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                    {question.subject}
                  </span>
                </div>
                {question.type === 'mcq' && question.options && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-700">Options:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {question.options.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(question)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(question.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H7V5a2 2 0 012-2z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default QuestionList;