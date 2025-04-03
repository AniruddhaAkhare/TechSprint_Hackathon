import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCurriculum from './CreateCurriculum';
import { db } from '../../../../config/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';

const Curriculum = () => {
  const { user, rolePermissions } = useAuth();
  const [curriculums, setCurriculums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [curriculumToEdit, setCurriculumToEdit] = useState(null);

  const navigate = useNavigate();

  const canCreate = rolePermissions.curriculums?.create || false;
  const canUpdate = rolePermissions.curriculums?.update || false;
  const canDelete = rolePermissions.curriculums?.delete || false;
  const canDisplay = rolePermissions.curriculums?.display || false;

  useEffect(() => {
    if (!canDisplay) return;
    const unsubscribe = onSnapshot(collection(db, 'curriculums'), (snapshot) => {
      const curriculumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurriculums(curriculumData);
    });
    return () => unsubscribe();
  }, [canDisplay]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const filteredCurriculums = curriculums.filter((curriculum) =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
  const paginatedCurriculums = filteredCurriculums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleRowClick = (id) => {
    if (canUpdate) {
      navigate(`/edit-curriculum/${id}`);
    } else {
      alert("You do not have permission to update curriculums.");
    }
  };

  const toggleDropdown = (id) => {
    if (canUpdate || canDelete) {
      setDropdownOpen(dropdownOpen === id ? null : id);
    }
  };

  const handleEditClick = (id) => {
    if (!canUpdate) {
      alert("You do not have permission to update curriculums.");
      return;
    }
    const curriculum = curriculums.find((c) => c.id === id);
    setCurriculumToEdit(curriculum);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteClick = (id) => {
    if (!canDelete) {
      alert("You do not have permission to delete curriculums.");
      return;
    }
    setSelectedCurriculumId(id);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const confirmDelete = async () => {
    if (selectedCurriculumId && canDelete) {
      try {
        await deleteDoc(doc(db, 'curriculums', selectedCurriculumId));
        setIsDeleteModalOpen(false);
        setSelectedCurriculumId(null);
      } catch (error) {
        console.error("Error deleting curriculum:", error);
      }
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCurriculumId(null);
  };

  const handleAddCurriculum = () => {
    if (!canCreate) {
      alert("You do not have permission to create curriculums.");
      return;
    }
    setCurriculumToEdit(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurriculumToEdit(null);
  };

  const handleAddCurriculumSubmit = (formData) => {
    handleCloseModal();
  };

  if (!canDisplay) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Access Denied: You do not have permission to view curriculums.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Curriculum</h2>
      <p className="text-sm text-gray-600 mb-6">Manage all your course curriculum in one place.</p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <select className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option>All Curriculum</option>
          </select>
          <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
            {curriculums.length.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-64 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {canCreate && (
            <button
              onClick={handleAddCurriculum}
              className="w-full sm:w-auto bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Curriculum
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Sr.</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Curriculum Name</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Content</th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCurriculums.length > 0 ? (
              paginatedCurriculums.map((curriculum, index) => (
                <tr
                  key={curriculum.id}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(curriculum.id)}
                >
                  <td className="p-3 text-gray-700">{index + 1}</td>
                  <td className="p-3 text-gray-700">{curriculum.name}</td>
                  <td className="p-3 text-gray-700">
                    <span className="inline-flex items-center">
                      ≡ {curriculum.sections || 0} Sections
                    </span>
                  </td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    {(canUpdate || canDelete) && (
                      <div className="relative">
                        <button
                          className="text-gray-600 hover:text-gray-800 text-lg"
                          onClick={() => toggleDropdown(curriculum.id)}
                        >
                          ⋮
                        </button>
                        {dropdownOpen === curriculum.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            {canUpdate && (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleEditClick(curriculum.id)}
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                onClick={() => handleDeleteClick(curriculum.id)}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No curriculums found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end items-center mt-6 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        <span className="px-3 py-1 bg-indigo-600 text-white rounded-md">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value={50}>50/page</option>
          <option value={25}>25/page</option>
          <option value={10}>10/page</option>
        </select>
      </div>

      {canCreate && (
        <CreateCurriculum
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddCurriculumSubmit}
          curriculumToEdit={curriculumToEdit}
        />
      )}

      {canDelete && isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Curriculum</h3>
              <button
                onClick={closeDeleteModal}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <p className="text-red-600 mb-6">
              Warning! Are you sure you want to delete this curriculum? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
              >
                Delete Curriculum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Curriculum;