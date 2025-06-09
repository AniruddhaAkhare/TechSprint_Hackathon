import React, { useState, useEffect } from 'react';
  import { db } from '../../../../config/firebase';
  import { collection, addDoc, updateDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
  import { toast } from 'react-toastify';
  import { useAuth } from '../../../../context/AuthContext';

  const AddSectionModal = ({ isOpen, onClose, curriculumId, sectionToEdit, logActivity }) => {
    const { user, rolePermissions } = useAuth();

    const canCreate = rolePermissions?.curriculums?.create || false;
    const canUpdate = rolePermissions?.curriculums?.update || false;

    const [formData, setFormData] = useState({
      name: '',
      description: '',
      isPrerequisite: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleInputChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!formData.name) {
        toast.error('Please enter a section name.');
        return;
      }

      if (sectionToEdit && !canUpdate) {
        toast.error("You do not have permission to update sections.");
        return;
      }
      if (!sectionToEdit && !canCreate) {
        toast.error("You do not have permission to create sections.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (sectionToEdit) {
          const sectionRef = doc(db, `curriculums/${curriculumId}/sections`, sectionToEdit.id);
          const oldDataSnap = await getDoc(sectionRef);
          const oldData = oldDataSnap.data() || {};

          await updateDoc(sectionRef, {
            name: formData.name,
            description: formData.description,
            isPrerequisite: formData.isPrerequisite,
          });

          const changes = Object.keys(formData).reduce((acc, key) => {
            if (JSON.stringify(oldData[key]) !== JSON.stringify(formData[key])) {
              acc[key] = { oldValue: oldData[key], newValue: formData[key] };
            }
            return acc;
          }, {});

          if (Object.keys(changes).length > 0) {
            await logActivity("Section updated", {
              curriculumId,
              sectionId: sectionToEdit.id,
              name: formData.name,
              changes
            });
            toast.success("Section updated successfully");
          } else {
            toast.info("No changes made to section");
          }
        } else {
          const docRef = await addDoc(collection(db, `curriculums/${curriculumId}/sections`), {
            name: formData.name,
            description: formData.description,
            isPrerequisite: formData.isPrerequisite,
            createdAt: serverTimestamp(),
          });

          await logActivity("Section created", {
            curriculumId,
            sectionId: docRef.id,
            name: formData.name
          });
          toast.success("Section added successfully");
        }

        setFormData({ name: '', description: '', isPrerequisite: false });
        setLoading(false);
        onClose();
      } catch (err) {
        // //console.error('Error saving section:', err);
        setError('Failed to save section: ' + err.message);
        toast.error('Failed to save section: ' + err.message);
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
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {sectionToEdit ? 'Edit Section' : 'Add New Section'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
                disabled={loading}
              >
                ✕
              </button>
            </div>

            {/* Permission Denied Message */}
            {((!sectionToEdit && !canCreate) || (sectionToEdit && !canUpdate)) ? (
              <div className="text-red-600 text-center flex-1 flex items-center justify-center">
                Access Denied: You do not have permission to {sectionToEdit ? 'update' : 'create'} sections.
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="space-y-6">
                  {/* Section Name Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Section Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Section Name"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                      disabled={loading}
                    />
                  </div>

                  {/* Short Description Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Section Description"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 resize-y"
                      maxLength="250"
                      disabled={loading}
                    />
                    <span className="text-xs text-gray-500 mt-1 block text-right">
                      {formData.description.length} / 250
                    </span>
                  </div>

                  {/* More Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">More Options</label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="isPrerequisite"
                        checked={formData.isPrerequisite}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 disabled:opacity-50"
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700">Make this a prerequisite</span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="text-red-600 text-sm text-center">{error}</div>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : sectionToEdit ? 'Update Section' : 'Add Section'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </>
    );
  };

  export default AddSectionModal;