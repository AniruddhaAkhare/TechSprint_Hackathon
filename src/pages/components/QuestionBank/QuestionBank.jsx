import React, { useState, useEffect } from 'react';
import { db } from '../../../config/firebase';
import { collection, addDoc, getDocs, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import QuestionList from './QusetionList'
import QuestionForm from './QuestionForm';
import { useAuth } from '../../../context/AuthContext';

const QuestionBank = () => {
  
  

  const [questions, setQuestions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const { user, rolePermissions } = useAuth();
  
    const canCreate = rolePermissions.templates?.create || false;
    const canUpdate = rolePermissions.templates?.update || false;
    const canDelete = rolePermissions.templates?.delete || false;
    const canDisplay = rolePermissions.templates?.display || false;

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = query(collection(db, 'questions'));
      const querySnapshot = await getDocs(q);
      const questionsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(questionsData);
    };
    fetchQuestions();
  }, []);

  const addQuestion = async (questionData) => {
    try {
      if (editingQuestion && canUpdate) {
        // Update existing question
        const questionRef = doc(db, 'questions', editingQuestion.id);
        await updateDoc(questionRef, questionData);
        setQuestions(questions.map(q => (q.id === editingQuestion.id ? { id: q.id, ...questionData } : q)));
        setEditingQuestion(null);
      } else if (canCreate) {
        // Add new question
        const docRef = await addDoc(collection(db, 'questions'), questionData);
        setQuestions([...questions, { id: docRef.id, ...questionData }]);
      }
      setIsPanelOpen(false);
    } catch (error) {
      console.error('Error adding/updating question:', error);
    }
  };

  const deleteQuestion = async (id) => {
    if (!canDelete) return; // Early return if no delete permission
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions(questions.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const editQuestion = (question) => {
    if (!canUpdate) return; // Early return if no update permission
    setEditingQuestion(question);
    setIsPanelOpen(true);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesType = filterType ? question.type === filterType : true;
    const matchesSubject = filterSubject ? question.subject === filterSubject : true;
    const matchesSearch = question.question.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Question Bank</h1>
        {canCreate && (
          <button
            onClick={() => {
              setEditingQuestion(null);
              setIsPanelOpen(true);
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full md:w-1/4 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          >
            <option value="">All Types</option>
            <option value="mcq">MCQ</option>
            <option value="short">Short Question</option>
            <option value="upload">Upload File</option>
            <option value="rating">Rating</option>
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="w-full md:w-1/4 p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700"
          >
            <option value="">All Subjects</option>
            <option value="math">Math</option>
            <option value="science">Science</option>
            <option value="history">History</option>
          </select>

          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search questions..."
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

      <QuestionList
        questions={filteredQuestions}
        onEdit={canUpdate ? editQuestion : null} // Pass null if no update permission
        onDelete={canDelete ? deleteQuestion : null} // Pass null if no delete permission
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 bg-white h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h2>
            <button onClick={() => setIsPanelOpen(false)} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <QuestionForm onAddQuestion={addQuestion} initialData={editingQuestion} />
        </div>
      </div>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-60 z-40"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
};

export default QuestionBank;