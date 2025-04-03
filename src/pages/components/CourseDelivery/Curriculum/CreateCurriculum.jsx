import React, { useState, useEffect } from 'react';
import { db } from '../../../../config/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

const CreateCurriculum = ({ isOpen, onClose, onSubmit, curriculumToEdit }) => {
  const { rolePermissions } = useAuth();

  const canCreate = rolePermissions.curriculums?.create || false;
  const canUpdate = rolePermissions.curriculums?.update || false;

  const [formData, setFormData] = useState({
    name: '',
    branch: 'Fireblaze',
    maxViewDuration: 'Unlimited',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (curriculumToEdit) {
      setFormData({
        name: curriculumToEdit.name || '',
        branch: curriculumToEdit.branch || 'Fireblaze',
        maxViewDuration: curriculumToEdit.maxViewDuration || 'Unlimited',
      });
    } else {
      setFormData({
        name: '',
        branch: 'Fireblaze',
        maxViewDuration: 'Unlimited',
      });
    }
  }, [curriculumToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter a curriculum name.');
      return;
    }

    if (curriculumToEdit && !canUpdate) {
      alert("You do not have permission to update curriculums.");
      return;
    }
    if (!curriculumToEdit && !canCreate) {
      alert("You do not have permission to create curriculums.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (curriculumToEdit) {
        const curriculumRef = doc(db, 'curriculums', curriculumToEdit.id);
        await updateDoc(curriculumRef, {
          name: formData.name,
          branch: formData.branch,
          maxViewDuration: formData.maxViewDuration,
        });
        onSubmit({
          id: curriculumToEdit.id,
          ...formData,
          sections: curriculumToEdit.sections || 0,
        });
      } else {
        const docRef = await addDoc(collection(db, 'curriculums'), {
          name: formData.name,
          branch: formData.branch,
          maxViewDuration: formData.maxViewDuration,
          sections: 0,
          createdAt: serverTimestamp(),
        });
        onSubmit({
          id: docRef.id,
          ...formData,
          sections: 0,
        });
      }

      setFormData({ name: '', branch: 'Fireblaze', maxViewDuration: 'Unlimited' });
      setLoading(false);
      onClose();
    } catch (err) {
      console.error('Error saving curriculum:', err);
      setError('Failed to save curriculum. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Side Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {curriculumToEdit ? 'Edit Curriculum' : 'Add Curriculum'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
              disabled={loading}
            >
              ✕
            </button>
          </div>

          {((!curriculumToEdit && !canCreate) || (curriculumToEdit && !canUpdate)) ? (
            <div className="text-red-600 text-center flex-1 flex items-center justify-center">
              Access Denied: You do not have permission to {curriculumToEdit ? 'update' : 'create'} curriculums.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter curriculum name"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    maxLength="100"
                    disabled={loading}
                  />
                  <span className="text-xs text-gray-500 mt-1 block">
                    {formData.name.length}/100
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                    disabled={loading}
                  >
                    <option value="Fireblaze">Fireblaze</option>
                    {/* Add more branches as needed */}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum View Duration
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="maxViewDuration"
                        value="Unlimited"
                        checked={formData.maxViewDuration === 'Unlimited'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Unlimited</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="maxViewDuration"
                        value="Restricted"
                        checked={formData.maxViewDuration === 'Restricted'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Restricted</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : curriculumToEdit ? 'Update Curriculum' : 'Add Curriculum'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCurriculum;
