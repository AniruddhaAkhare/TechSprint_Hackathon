import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCurriculum from './CreateCurriculum'; // Import the CreateCurriculum modal
import { db } from '../../../../config/firebase'; // Import Firestore
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; // Firestore methods

const Curriculum = () => {
  const [curriculums, setCurriculums] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCurriculumId, setSelectedCurriculumId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [curriculumToEdit, setCurriculumToEdit] = useState(null); // Track the curriculum to edit

  const navigate = useNavigate();

  // Fetch curriculums from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'curriculums'), (snapshot) => {
      const curriculumData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCurriculums(curriculumData);
    });
    return () => unsubscribe();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter curriculums based on search term
  const filteredCurriculums = curriculums.filter((curriculum) =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle pagination
  const totalPages = Math.ceil(filteredCurriculums.length / itemsPerPage);
  const paginatedCurriculums = filteredCurriculums.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Handle row click to navigate to the edit page
  const handleRowClick = (id) => {
        navigate(`/edit-curriculum/${id}`);
      };

  // Toggle dropdown for a specific row
  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  // Handle edit button click
  const handleEditClick = (id) => {
    const curriculum = curriculums.find((c) => c.id === id);
    setCurriculumToEdit(curriculum);
    setIsModalOpen(true);
    setDropdownOpen(null);
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setSelectedCurriculumId(id);
    setIsDeleteModalOpen(true);
    setDropdownOpen(null);
  };

  // Confirm deletion
  const confirmDelete = async () => {
    if (selectedCurriculumId) {
      try {
        await deleteDoc(doc(db, 'curriculums', selectedCurriculumId));
        setIsDeleteModalOpen(false);
        setSelectedCurriculumId(null);
      } catch (error) {
        console.error("Error deleting curriculum:", error);
      }
    }
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedCurriculumId(null);
  };

  // Open the create curriculum modal
  const handleAddCurriculum = () => {
    setCurriculumToEdit(null); // Clear any existing curriculum data for adding new
    setIsModalOpen(true);
  };

  // Close the create curriculum modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurriculumToEdit(null);
  };

  // Handle form submission from the modal
  const handleAddCurriculumSubmit = (formData) => {
    handleCloseModal();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <h2 style={styles.header}>Curriculum</h2>
      <p style={styles.subHeader}>Manage all your course curriculum in one place.</p>

      {/* Filters and Actions */}
      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <select style={styles.select}>
            <option>All Curriculum</option>
          </select>
          <span style={styles.badge}>{curriculums.length.toString().padStart(2, '0')}</span>
        </div>
        <div style={styles.searchAndAdd}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            style={styles.searchInput}
          />
          <button onClick={handleAddCurriculum} style={styles.addButton}>
            + Add Curriculum
          </button>
        </div>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableCell}>Sr.</th>
            <th style={styles.tableCell}>Curriculum Name</th>
            <th style={styles.tableCell}>Content</th>
            <th style={styles.tableCell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCurriculums.length > 0 ? (
            paginatedCurriculums.map((curriculum, index) => (
              <tr
                key={curriculum.id}
                style={styles.tableRow}
                onClick={() => handleRowClick(curriculum.id)}
              >
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{curriculum.name}</td>
                <td style={styles.tableCell}>
                  <span style={styles.sections}>
                    ≡ {curriculum.sections || 0} Sections
                  </span>
                </td>
                <td style={styles.tableCell} onClick={(e) => e.stopPropagation()}>
                  <div style={styles.actionContainer}>
                    <button
                      style={styles.actionButton}
                      onClick={() => toggleDropdown(curriculum.id)}
                    >
                      ⋮
                    </button>
                    {dropdownOpen === curriculum.id && (
                      <div style={styles.dropdown}>
                        <button
                          style={styles.dropdownButton}
                          onClick={() => handleEditClick(curriculum.id)}
                        >
                          Edit
                        </button>
                        <button
                          style={{ ...styles.dropdownButton, color: '#ff0000' }}
                          onClick={() => handleDeleteClick(curriculum.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={styles.noData}>
                No curriculums found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={styles.pagination}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={styles.pageButton}
        >
          &lt;
        </button>
        <span style={styles.pageNumber}>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={styles.pageButton}
        >
          &gt;
        </button>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          style={styles.itemsPerPage}
        >
          <option value={50}>50/page</option>
          <option value={25}>25/page</option>
          <option value={10}>10/page</option>
        </select>
      </div>

      {/* Create Curriculum Modal */}
      <CreateCurriculum
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleAddCurriculumSubmit}
        curriculumToEdit={curriculumToEdit} // Pass the curriculum to edit
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteModal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Delete Curriculum</h3>
              <button onClick={closeDeleteModal} style={styles.closeButton}>×</button>
            </div>
            <p style={styles.modalMessage}>
              Warning! Are you sure you want to delete this curriculum? This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button onClick={closeDeleteModal} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={styles.deleteButton}>
                Delete Curriculum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles (unchanged)
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  subHeader: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  filterItem: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  badge: {
    backgroundColor: '#f0f0f0',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '12px',
  },
  searchAndAdd: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginRight: '10px',
  },
  addButton: {
    padding: '5px 15px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#f9f9f9',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    textAlign: 'left',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  tableRow: {
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  sections: {
    display: 'inline-flex',
    alignItems: 'center',
  },
  actionContainer: {
    position: 'relative',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  },
  dropdown: {
    position: 'absolute',
    right: '0',
    top: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  dropdownButton: {
    display: 'block',
    width: '100px',
    padding: '8px',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
    color: '#000',
  },
  noData: {
    textAlign: 'center',
    padding: '20px',
    color: '#666',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '5px 10px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
    margin: '0 5px',
  },
  pageNumber: {
    padding: '5px 10px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: '#fff',
    borderRadius: '5px',
  },
  itemsPerPage: {
    padding: '5px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginLeft: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  deleteModal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  modalMessage: {
    color: '#ff0000',
    marginBottom: '20px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  },
  cancelButton: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    border: '1px solid #ff0000',
    backgroundColor: '#fff',
    color: '#ff0000',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Curriculum;