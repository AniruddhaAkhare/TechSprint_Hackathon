import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; // Firestore methods

const AddSectionModal = ({ isOpen, onClose, curriculumId, sectionToEdit }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrerequisite: false,
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (sectionToEdit) {
      setFormData({
        name: sectionToEdit.name || '',
        description: sectionToEdit.description || '',
        isPrerequisite: sectionToEdit.isPrerequisite || false,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isPrerequisite: false,
      });
    }
  }, [sectionToEdit]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a section name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (sectionToEdit) {
        // Update existing section
        const sectionRef = doc(db, `curriculums/${curriculumId}/sections`, sectionToEdit.id);
        await updateDoc(sectionRef, {
          name: formData.name,
          description: formData.description,
          isPrerequisite: formData.isPrerequisite,
        });
      } else {
        // Add new section
        await addDoc(collection(db, `curriculums/${curriculumId}/sections`), {
          name: formData.name,
          description: formData.description,
          isPrerequisite: formData.isPrerequisite,
          createdAt: serverTimestamp(),
        });
      }

      // Reset form and close modal
      setFormData({ name: '', description: '', isPrerequisite: false });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error saving section:', err);
      setError('Failed to save section. Please try again.');
      setLoading(false);
    }
  };

  // If the modal is not open, return null
  if (!isOpen) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <h3>{sectionToEdit ? 'Edit Section' : 'Add New Section'}</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Section Name Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Section Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Section Name"
              style={styles.input}
              disabled={loading}
            />
          </div>

          {/* Short Description Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Section Description"
              style={styles.textarea}
              maxLength="250"
              disabled={loading}
            />
            <span style={styles.charCount}>{formData.description.length} / 250</span>
          </div>

          {/* More Options */}
          <div style={styles.formGroup}>
            <label style={styles.label}>More Options</label>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isPrerequisite"
                checked={formData.isPrerequisite}
                onChange={handleInputChange}
                style={styles.checkbox}
                disabled={loading}
              />
              Make this a prerequisite
            </label>
          </div>

          {/* Error Message */}
          {error && <div style={styles.errorMessage}>{error}</div>}

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Back
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : sectionToEdit ? 'Update Section' : 'Add Section'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Inline styles (unchanged)
const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    width: '400px',
    height: '100%',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    animation: 'slideIn 0.3s ease-out',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '5px',
  },
  required: {
    color: 'red',
  },
  input: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    minHeight: '100px',
    resize: 'vertical',
  },
  charCount: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
  },
  checkbox: {
    marginRight: '10px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 15px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

// Add keyframes for slide-in animation
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default AddSectionModal;