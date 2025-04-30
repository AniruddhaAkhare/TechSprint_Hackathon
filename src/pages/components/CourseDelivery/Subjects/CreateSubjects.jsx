import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase.jsx'
import { collection, addDoc } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { setDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import Subjects from './Subjects.jsx';

const SelectControl = ({ options, ...props }) => (
  <SelectContainer>
    <Select options={options} {...props} />
  </SelectContainer>
);

const CreateSubjects = ({ isOpen, toggleSidebar }) => {

  const [subjectName, setSubjectName] = useState('');
  const [curriculum, setCurriculum] = useState('');
  const [courseID, setCourseID] = useState('');
    const [selectedBatches, setSelectedBatches] = useState([]);
    // const [subjectType, setSubjectType] = useState('batch'); // Added subjectType state

  const [instructor, setInstructor] = useState(''); // Added instructor state
  const [courses, setCourses] = useState('');
  const [batches, setBatches] = useState('');

  // const [instructorId, setInstructorId] =  useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      const snapshot = await getDocs(collection(db, "Courses"));
      const courseData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseData);
    };

    const fetchBatches = async () => {
      const snapshot = await getDocs(collection(db, "Batches"));
      const batchData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBatches(batchData);
    };

    fetchCourses();
    fetchBatches();
  }, []);



  const navigate = useNavigate();

  const subjectCollectionRef = collection(db, "Subjects");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const subjectData = {
        name: subjectName,
        curriculum,
        courseID,
        batches: selectedBatches,
      };
      await addDoc(collection(db, "Subjects"), subjectData);
      console.log("Subject created successfully", subjectData);
      toggleSidebar();
    } catch (error) {
      console.error("Error creating subject:", error);
    }
  };



  return (
    <div className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} p-4 overflow-y-auto`}>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <button
          type="button" className="close-button" onClick={toggleSidebar}>
          Back
        </button>

        <h1 className="text-xl font-bold mb-6">Create Subject</h1>


        <div className="mb-6">
          <label htmlFor="subjectName" className="block text-gray-700">Subject Name</label>
          <input
            type="text"
            id="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            maxLength="100"
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />

        </div>

        <div className="mb-6">
          <label htmlFor="curriculum" className="block text-gray-700">Curriculum</label>
          <textarea
            id="curriculum"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            required
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />

          <label htmlFor="courseID" className="block text-gray-700">Select Course</label>
          <select
            id="courseID"
            value={courseID}
            onChange={(e) => setCourseID(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select a Course</option>
            {/* Options to be populated from Firestore */}
          </select>

          <label className="block text-gray-700">Select Batches</label>
          <select
            multiple
            value={selectedBatches}
            onChange={(e) => setSelectedBatches([...e.target.selectedOptions].map(option => option.value))}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            {/* Options to be populated from Firestore */}
          </select>

        </div>

        <div className="mb-6">
          <label htmlFor="instructor" className="block text-gray-700">Instructor</label>
          <select
            id="instructor"
            value={instructor}
            onChange={(e) => setInstructor(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          >
            <option value="">Select an Instructor</option>
            <option value="instructor1">Instructor 1</option>
            <option value="instructor2">Instructor 2</option>
          </select>

        </div>

        <div className="mb-6">
                    <label className="block text-gray-700">Subject Type</label>
                    
        </div>

        

         <div className="flex justify-end space-x-4 mt-4">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
          >
            Save Subject
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSubjects;
