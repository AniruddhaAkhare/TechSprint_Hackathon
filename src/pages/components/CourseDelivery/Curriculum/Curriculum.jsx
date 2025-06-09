import React, { useState, useEffect, useCallback } from 'react';
import CreateCurriculum from './CreateCurriculum';
import { db } from '../../../../config/firebase';
import { collection, onSnapshot, deleteDoc, doc, updateDoc, setDoc, arrayUnion, increment } from 'firebase/firestore';
import { useAuth } from '../../../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import { runTransaction } from 'firebase/firestore';

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
  const navigate = useNavigate();

  const canCreate = rolePermissions.curriculums?.create || false;
  const canUpdate = rolePermissions.curriculums?.update || false;
  const canDelete = rolePermissions.curriculums?.delete || false;
  const canDisplay = rolePermissions.curriculums?.display || false;

  const logActivity = async (action, details) => {
    if (!user?.email) return;
  
    const activityLogRef = doc(db, "activityLogs", "logDocument");
  
    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Curriculum",
      // adminId: adminId || "N/A",
    };
  
    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];
  
        // Ensure logs is an array and contains only valid data
        if (!Array.isArray(logs)) {
          logs = [];
        }
  
        // Append the new log entry
        logs.push(logEntry);
  
        // Trim to the last 1000 entries if necessary
        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }
  
        // Update the document with the new logs array
        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully");
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };
    
    const fetchLogs = useCallback(() => {
      if (!isAdmin) return;
      const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const allLogs = [];
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            (data.logs || []).forEach((log) => {
              allLogs.push({ id: doc.id, ...log });
            });
          });
          allLogs.sort(
            (a, b) =>
              (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
          );
          setLogs(allLogs);
        },
      );
      return unsubscribe;
    }, [isAdmin]);

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
      // //console.error("Error fetching curriculums:", err.message);
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
        await logActivity("Curriculum deleted", { name: curriculum.name || 'Unknown' });
        setIsDeleteModalOpen(false);
        setSelectedCurriculumId(null);
        toast.success("Curriculum deleted successfully.");
      } catch (error) {
        // //console.error("Error deleting curriculum:", error.message);
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
        await logActivity("Curriculum updated", {
          name: formData.name,
          changes: { oldName: curriculumToEdit.name, newName: formData.name }
        });
      } else {
        await logActivity("Curriculum created", { name: formData.name });
      }
      handleCloseModal();
      toast.success(`Curriculum ${curriculumToEdit ? 'updated' : 'created'} successfully.`);
    } catch (error) {
      // //console.error("Error logging curriculum action:", error.message);
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
    <div className=" bg-gray-100 min-h-screen font-sans p-4 fixed inset-0 left-[300px]">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold text-[#333333] font-sans">Curriculum</h2>
      <p className="text-sm text-gray-600 mb-6">Manage all your course curriculum in one place.</p>

   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
  {/* Filter + Count */}
  <div className="flex items-center space-x-3 bg-white shadow-md rounded-lg px-4 py-2">
  <select
    className="w-56 h-8 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white cursor-pointer transition"
    aria-label="Filter Curriculum"
  >
    <option>All Curriculum</option>
  </select>
  <span className="inline-flex items-center h-8 bg-indigo-100 text-indigo-700 px-4 rounded-full text-sm font-semibold select-none">
    {curriculums.length.toString().padStart(2, '0')}
  </span>
</div>


  {/* Search + Add button */}
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
   <div className="relative w-full sm:w-64">
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    placeholder="Search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="h-10 w-full pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
    aria-label="Search Curriculums"
  />
</div>

    {canCreate && (
      <button
        onClick={handleAddCurriculum}
        className="h-10 w-full sm:w-auto bg-indigo-600 text-white px-5 rounded-md hover:bg-indigo-700 transition-colors shadow-md flex items-center justify-center gap-2 font-semibold"
        aria-label="Add Curriculum"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
        Add Curriculum
      </button>
    )}
  </div>
</div>

     <div className="bg-white rounded-xl shadow-lg overflow-y-scroll h-[25vw]">
  <table className="w-full table-fixed border-collapse">
    <thead className="bg-gray-100">
      <tr>
        <th className="w-1/12 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Sr.</th>
        <th className="w-5/12 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Curriculum Name</th>
        <th className="w-3/12 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Content</th>
        <th className="w-3/12 p-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedCurriculums.length > 0 ? (
        paginatedCurriculums.map((curriculum, index) => (
          <tr
            key={curriculum.id}
            className={`border-b border-gray-200 transition duration-200 hover:bg-indigo-50 cursor-pointer`}
            onClick={() => canUpdate && handleRowClick(curriculum.id)}
          >
            <td className="w-1/12 p-4 text-gray-700 font-medium">{(currentPage - 1) * itemsPerPage + index + 1}</td>
            <td className="w-5/12 p-4 text-gray-800 font-semibold">{curriculum.name}</td>
            <td className="w-3/12 p-4 text-gray-600">
              <span className="inline-flex items-center space-x-1">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
                <span>{curriculum.sections || 0} Sections</span>
              </span>
            </td>
            <td className="w-3/12 p-4" onClick={(e) => e.stopPropagation()}>
              {(canUpdate || canDelete) && (
                <div className="relative inline-block text-left">
                  <button
                    className="inline-flex justify-center items-center w-8 h-8 text-gray-600 hover:text-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    onClick={() => toggleDropdown(curriculum.id)}
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen === curriculum.id}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6-2a2 2 0 100 4 2 2 0 000-4zm6 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                  {dropdownOpen === curriculum.id && (
                    <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30">
                      <div className="py-1">
                        {canUpdate && (
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 transition"
                            onClick={() => handleEditClick(curriculum.id)}
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 hover:text-red-800 transition"
                            onClick={() => handleDeleteClick(curriculum.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" className="p-6 text-center text-gray-400 italic">
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