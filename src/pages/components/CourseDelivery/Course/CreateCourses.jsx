import React from 'react';

const CreateCourses = ({ onClose }) => {
  return (
    <div className="create-course-form-overlay">
      <div className="create-course-form">
        <div className="form-header">
          <div className="form-title">Create Course</div>
          <button className="close-button" onClick={onClose}>
            X
          </button>
        </div>

        <div className="form-content">
          <div className="thumbnail-upload">
            <div className="upload-area">
              <span role="img" aria-label="upload icon">
                📁
              </span>
              <p>Click or drag file to this area to upload</p>
              <p className="upload-info">
                Max. file size supported is 1MB. Preferred dimensions for upload
                is 1080px x 720px
              </p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="courseName">Course name</label>
            <input type="text" id="courseName" placeholder="Enter course name" />
            <span className="char-count">0/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="A short description of your course"
            ></textarea>
            <span className="char-count">0/400</span>
          </div>

          <div className="form-group">
            <label htmlFor="prettyName">Pretty name</label>
            <input
              type="text"
              id="prettyName"
              placeholder="Enter short course name"
            />
            <span className="char-count">0/50</span>
          </div>

          <div className="form-group">
            <label>Course Type</label>
            <div className="course-type-options">
              <div className="option">
                <input type="radio" id="online" name="courseType" />
                <label htmlFor="online">Online only</label>
                <p>Select this if this package is intended only for online coaching.</p>
              </div>
              <div className="option">
                <input type="radio" id="classroom" name="courseType" />
                <label htmlFor="classroom">Classroom Program</label>
                <p>
                  Select this if the learners can enrol in this package for
                  classroom program at your institution.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="create-button">Create Course</button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourses;