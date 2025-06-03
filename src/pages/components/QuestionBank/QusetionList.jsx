import React from 'react';

const QuestionList = ({ questions, onEdit, onDelete, onSelect, selectedQuestions, onSelectAll }) => {
  return (
  <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-6xl mx-auto">
  {questions.length === 0 ? (
    <p className="text-gray-400 italic text-center py-10">No questions found</p>
  ) : (
    <>
      <div className="p-5 border-b border-gray-200 flex items-center bg-gray-50">
        <input
          type="checkbox"
          onChange={onSelectAll}
          checked={selectedQuestions.length === questions.length && questions.length > 0}
          className="mr-4 h-5 w-5 text-indigo-600 rounded-md focus:ring-indigo-500"
        />
        <span className="text-gray-800 font-semibold text-lg select-none">Select All</span>
      </div>
      {questions.map((question, index) => (
        <div
          key={question.id}
          className={`p-5 ${
            index !== questions.length - 1 ? 'border-b border-gray-100' : ''
          } hover:bg-indigo-50 transition-colors flex items-start group`}
        >
          <input
            type="checkbox"
            checked={selectedQuestions.includes(question.id)}
            onChange={() => onSelect(question.id)}
            className="mt-1 mr-4 h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-base mb-2">{question.question}</p>
            <div className="flex gap-3 text-sm text-gray-600 mb-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full capitalize font-medium">
                {question.type}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full capitalize font-medium">
                {question.subject}
              </span>
            </div>
            {question.type === 'mcq' && question.options && (
              <div className="mt-2">
                <p className="text-sm font-semibold text-gray-700">Options:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {question.options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(question)}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-sm transition"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(question.id)}
                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-sm transition"
                title="Delete"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v1H7V5a2 2 0 012-2z"
                  />
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