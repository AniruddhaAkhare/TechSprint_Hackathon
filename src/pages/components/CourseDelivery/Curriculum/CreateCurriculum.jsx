
import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'; // Firestore methods

const CreateCurriculum = ({ isOpen, onClose, onSubmit, curriculumToEdit }) => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    branch: 'Fireblaze', // Default value
    maxViewDuration: 'Unlimited', // Default value
  });

  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (curriculumToEdit) {
      setFormData({
        name: curriculumToEdit.name || '',
        branch: curriculumToEdit.branch || 'Fireblaze',
        maxViewDuration: curriculumToEdit.maxViewDuration || 'Unlimited',
      });
    } else {
      // Reset form for adding new curriculum
      setFormData({
        name: '',
        branch: 'Fireblaze',
        maxViewDuration: 'Unlimited',
      });
    }
  }, [curriculumToEdit]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a curriculum name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (curriculumToEdit) {
        // Update existing curriculum
        const curriculumRef = doc(db, 'curriculums', curriculumToEdit.id);
        await updateDoc(curriculumRef, {
          name: formData.name,
          branch: formData.branch,
          maxViewDuration: formData.maxViewDuration,
        });
        // Pass the updated data to the parent component
        onSubmit({
          id: curriculumToEdit.id,
          ...formData,
          sections: curriculumToEdit.sections || 0,
        });
      } else {
        // Add new curriculum
        const docRef = await addDoc(collection(db, 'curriculums'), {
          name: formData.name,
          branch: formData.branch,
          maxViewDuration: formData.maxViewDuration,
          sections: 0, // Default value for sections
          createdAt: serverTimestamp(),
        });
        // Pass the form data to the parent component, including the Firestore document ID
        onSubmit({
          id: docRef.id,
          ...formData,
          sections: 0,
        });
      }

      // Reset form and close modal
      setFormData({ name: '', branch: 'Fireblaze', maxViewDuration: 'Unlimited' });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error saving curriculum:', err);
      setError('Failed to save curriculum. Please try again.');
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
          <h3>{curriculumToEdit ? 'Edit Curriculum' : 'Add Curriculum'}</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={loading}>
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Name <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter curriculum name"
              style={styles.input}
              maxLength="100"
              disabled={loading}
            />
            <span style={styles.charCount}>{formData.name.length}/100</span>
          </div>

          {/* Branch Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Branch</label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              style={styles.selectInput}
              disabled={loading}
            >
              <option value="Fireblaze">Fireblaze</option>
              {/* Add more branches as needed */}
            </select>
          </div>

          {/* Maximum View Duration Field */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Maximum View Duration</label>
            <div>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="maxViewDuration"
                  value="Unlimited"
                  checked={formData.maxViewDuration === 'Unlimited'}
                  onChange={handleInputChange}
                  style={styles.radio}
                  disabled={loading}
                />
                Unlimited
              </label>
              <label style={styles.radioLabel}>
                <input
                  type="radio"
                  name="maxViewDuration"
                  value="Restricted"
                  checked={formData.maxViewDuration === 'Restricted'}
                  onChange={handleInputChange}
                  style={styles.radio}
                  disabled={loading}
                />
                Restricted
              </label>
            </div>
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
              Cancel
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Saving...' : curriculumToEdit ? 'Update Curriculum' : 'Add Curriculum'}
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
  charCount: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    textAlign: 'right',
    marginTop: '5px',
  },
  selectInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  radioLabel: {
    display: 'block',
    margin: '5px 0',
  },
  radio: {
    marginRight: '10px',
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
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
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

export default CreateCurriculum;