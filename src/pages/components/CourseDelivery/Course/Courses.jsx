import React, { useState, useEffect, useRef } from 'react';
import './Courses.css';
import CreateCourses from './CreateCourses';
import { db } from '../../../../config/firebase';
import { collection, onSnapshot, doc, addDoc , deleteDoc } from 'firebase/firestore';

const Courses = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which dropdown is open
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Course'), (snapshot) => {
      const courseList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    });

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNewCourseClick = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  const handleCreateCourse = async (courseData) => {
    try {
      await addDoc(collection(db, 'Course'), courseData);
      setIsFormOpen(false);
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Error creating course. Please try again.');
    }
  };

  const toggleDropdown = (courseId) => {
    setDropdownOpen(dropdownOpen === courseId ? null : courseId);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteDoc(doc(db, 'Course', courseId));
        alert('Course deleted successfully!');
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Error deleting course. Please try again.');
      }
    }
  };

  return (
    <div className="flex-col w-screen ml-80 p-4 courses-list-container">
      <div className="header">
        <div className="title">
          Courses <span className="published">{courses.length} PUBLISHED</span>
        </div>
        <button className="new-course-button" onClick={handleNewCourseClick}>
          + New Course
        </button>
      </div>

      <div className="filter-search">
        <div className="filter">
          Courses
          <select className="filter-select">
            <option value="all">All</option>
          </select>
        </div>
        <div className="search">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
      </div>

      <table className="courses-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Course name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course.id}>
              <td>{index + 1}</td>
              <td>
                <div className="course-name">
                  <div className="course-icon">
                    <span role="img" aria-label="course icon">
                      📒
                    </span>
                  </div>
                  <span>{course.courseName}</span>
                </div>
              </td>
              <td>
                <div className="actions" ref={dropdownRef}>
                  <button
                    className="actions-button"
                    onClick={() => toggleDropdown(course.id)}
                  >
                    ...
                  </button>
                  {dropdownOpen === course.id && (
                    <div className="dropdown">
                      <button className="dropdown-item">Edit</button>
                      <button className="dropdown-item">Reorder</button>
                      <button
                        className="dropdown-item archive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Archive
                      </button>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <div className="pagination-info">
          {`1-${courses.length} of ${courses.length} items`}
        </div>
        <div className="pagination-controls">
          <select className="page-select">
            <option value="1">1</option>
          </select>
          <select className="items-per-page">
            <option value="50">50/page</option>
          </select>
        </div>
      </div>

      {isFormOpen && (
        <CreateCourses onClose={handleCloseForm} onCreateCourse={handleCreateCourse} />
      )}
    </div>
  );
};

export default Courses;