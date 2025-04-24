import React, { useState, useEffect, useCallback } from 'react';
import CreateCurriculum from './CreateCurriculum';
import { db } from '../../../../config/firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash/debounce';

const Curriculum = () => {
  const { user, rolePermissions } = useAuth();
  const [curriculums, setCurriculums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCurriculums, setFilteredCurriculums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [curriculumToEdit, setCurriculumToEdit] = useState(null);

  const canCreate = rolePermissions.curriculums?.create || false;
  const canUpdate = rolePermissions.curriculums?.update || false;
  const canDelete = rolePermissions.curriculums?.delete || false;
  const canDisplay = rolePermissions.curriculums?.display || false;

  const logActivity = async (action, details) => {
    if (!user) {
      console.error("No user logged in for logging activity");
      return;
    }
    try {
      const logDocRef = doc(db, "activityLogs", "currentLog");
      const logEntry = {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email || 'Unknown',
        action,
        details
      };
      await updateDoc(logDocRef, {
        logs: arrayUnion(logEntry),
        count: increment(1)
      }).catch(async (err) => {
        if (err.code === 'not-found') {
          await setDoc(logDocRef, { logs: [logEntry], count: 1 });
        } else {
          throw err;
        }
      });
      console.log("Activity logged:", { action, details });
    } catch (err) {
      console.error("Error logging activity:", err.message);
      toast.error("Failed to log activity.");
    }
  };

  useEffect(() => {
    if (!canDisplay) return;
    const unsubscribe = onSnapshot(collection(db, 'curriculums'), (snapshot) => {
      const curriculumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurriculums(curriculumData);
      setFilteredCurriculums(curriculumData);
    }, (err) => {
      console.error("Error fetching curriculums:", err.message);
      toast.error("Failed to fetch curriculums");
    });
    return () => unsubscribe();
  }, [canDisplay]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      const results = curriculums.filter((curriculum) =>
        curriculum.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCurriculums(results);
      setCurrentPage(1);
      if (results.length === 0 && term.trim()) {
        toast.warn("No curriculums match the search term.");
      }
    }, 300),
    [curriculums]
  );

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
  const paginatedCurriculums = filteredCurriculums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleAddCurriculum = () => {
    if (!canCreate) {
      toast.error("You do not have permission to create curriculums.");
      return;
    }
    setCurriculumToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (id) => {
    if (!canUpdate) {
      toast.error("You do not have permission to update curriculums.");
      return;
    }
    const curriculum = curriculums.find((c) => c.id === id);
    setCurriculumToEdit(curriculum);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  const handleDeleteClick = (id) => {
    if (!canDelete) {
      toast.error("You do not have permission to delete curriculums.");
      return;
    }
    setSelectedCurriculumId(id);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  const confirmDelete = async () => {
    if (selectedCurriculumId && canDelete) {
      try {
        const curriculum = curriculums.find(c => c.id === selectedCurriculumId);
        if (!curriculum) throw new Error("Curriculum not found");
        await deleteDoc(doc(db, 'curriculums', selectedCurriculumId));
        await logActivity("Deleted curriculum", { name: curriculum.name || 'Unknown' });
        setIsDeleteModalOpen(false);
        setSelectedCurriculumId(null);
        toast.success("Curriculum deleted successfully.");
      } catch (error) {
        console.error("Error deleting curriculum:", error.message);
        toast.error("Failed to delete curriculum.");
      }
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCurriculumId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurriculumToEdit(null);
  };

  const handleAddCurriculumSubmit = async (formData) => {
    try {
      if (curriculumToEdit) {
        await logActivity("Updated curriculum", {
          name: formData.name,
          changes: { oldName: curriculumToEdit.name, newName: formData.name }
        });
      } else {
        await logActivity("Created curriculum", { name: formData.name });
      }
      handleCloseModal();
      toast.success(`Curriculum ${curriculumToEdit ? 'updated' : 'created'} successfully.`);
    } catch (error) {
      console.error("Error logging curriculum action:", error.message);
      toast.error("Failed to log curriculum action.");
    }
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
      <ToastContainer position="top-right" autoClose={3000} />
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
            onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="bg-white rounded-lg shadow-md">
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
                  onClick={() => canUpdate && handleEditClick(curriculum.id)}
                >
                  <td className="p-3 text-gray-700">{(currentPage - 1) * itemsPerPage + index + 1}</td>
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
                          className="text-gray-600 hover:text-gray-800 text-lg font-bold"
                          onClick={() => toggleDropdown(curriculum.id)}
                        >
                          ⋮
                        </button>
                        {dropdownOpen === curriculum.id && (
                          <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-20">
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
          Back
        </button>
        <span className="px-3 py-1 bg-indigo-600 text-white rounded-md">
          {currentPage}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
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

      {(canCreate || canUpdate) && (
        <CreateCurriculum
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleAddCurriculumSubmit}
          curriculumToEdit={curriculumToEdit}
          logActivity={logActivity}
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