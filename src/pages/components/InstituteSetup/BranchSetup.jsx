import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaEdit, FaTrash } from "react-icons/fa";
import BranchFormModal from "./BranchFormModal";

const BranchSetup = ({ instituteId, canCreate, canUpdate, canDelete, setActiveStep }) => {
  const [branches, setBranches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);

  useEffect(() => {
    if (instituteId) {
      const fetchBranches = async () => {
        try {
          const branchesSnapshot = await getDocs(collection(db, "instituteSetup", instituteId, "Center"));
          const branchList = branchesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          branchList.sort((a, b) => a.name.localeCompare(b.name));
          setBranches(branchList);
        } catch (error) {
          console.error("Error fetching branches:", error);
        }
      };
      fetchBranches();
    }
  }, [instituteId]);

  const handleEditBranch = (branch) => {
    if (!canUpdate) {
      alert("You don't have permission to edit branches");
      return;
    }
    setCurrentBranch(branch);
    setShowModal(true);
  };

  const handleDeleteBranch = async (branchId) => {
    if (!canDelete) return;
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await deleteDoc(doc(db, "instituteSetup", instituteId, "Center", branchId));
        setBranches(branches.filter((branch) => branch.id !== branchId));
        alert("Branch deleted successfully!");
      } catch (error) {
        console.error("Error deleting branch: ", error);
        alert("Error deleting branch");
      }
    }
  };

  return (
    <>
      <div className="edit-section">
        <h2>Center Management</h2>
      </div>
      <p>Set up centers for your institute</p>
      {canCreate && (
        <button
          className="add-branch-btn"
          onClick={() => {
            setShowModal(true);
            setCurrentBranch(null);
          }}
        >
          + Add Center
        </button>
      )}
      <div className="branch-table">
        <div className="table-header">
          <span>Name</span>
          <span>Address</span>
          <span>Contact Number</span>
          <span>Email</span>
          <span>Status</span>
          {(canUpdate || canDelete) && <span>Actions</span>}
        </div>
        {branches.map((branch) => (
          <div key={branch.id} className="table-row">
            <span>{branch.name}</span>
            <span>
              {branch.addressLine1}, {branch.city}, {branch.state}, {branch.postalCode}
            </span>
            <span>{branch.contactNumber || "Not set"}</span>
            <span>{branch.email || "Not set"}</span>
            <span className="status">
              <span className={`status-dot ${branch.isActive ? "active" : "inactive"}`}></span>
              {branch.isActive ? "Active" : "Inactive"}
            </span>
            {(canUpdate || canDelete) && (
              <span className="actions">
                {canUpdate && <FaEdit className="action-icon" onClick={() => handleEditBranch(branch)} />}
                {canDelete && (
                  <FaTrash
                    className="action-icon delete"
                    onClick={() => handleDeleteBranch(branch.id)}
                  />
                )}
              </span>
            )}
          </div>
        ))}
      </div>
      <button
        className="next-btn"
        onClick={() => setActiveStep("Contact Information")}
      >
        Next →
      </button>
      {showModal && (canCreate || (canUpdate && currentBranch)) && (
        <BranchFormModal
          instituteId={instituteId}
          currentBranch={currentBranch}
          setShowModal={setShowModal}
          setBranches={setBranches}
          canCreate={canCreate}
          canUpdate={canUpdate}
        />
      )}
    </>
  );
};

export default BranchSetup;