import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // Add useNavigate for navigation
import { db } from "../../../config/firebase";
import {
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  increment,
  arrayUnion,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from "@mui/material";

import { useAuth } from "../../../context/AuthContext";
import debounce from "lodash/debounce";
import CreateEnquiryForm from "./CreateEnquiryForm";
import FormViewer from "./FormViewer";

export default function EnquiryForms() {
  const { user, rolePermissions } = useAuth();
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const [currentForm, setCurrentForm] = useState(null);
  const [forms, setForms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(
    "Are you sure you want to delete this form? This action cannot be undone."
  );
  const [enquiryCounts, setEnquiryCounts] = useState({});
  const [selectedForm, setSelectedForm] = useState(null);

  const handleViewForm = (form) => {
    setSelectedForm(form);
  };

  const handleCloseViewer = () => {
    setSelectedForm(null);
  };

  // New handler for viewing enquiries
  const handleViewEnquiries = (formId) => {
    // Navigate to a new route to view enquiries for this form
    navigate(`/enquiries/${formId}`);
  };


  const canCreate = rolePermissions?.enquiries?.create || false;
  const canUpdate = rolePermissions?.enquiries?.update || false;
  const canDelete = rolePermissions?.enquiries?.delete || false;
  const canDisplay = rolePermissions?.enquiries?.display || false;
  // Add permission check for viewing enquiries (if applicable)
  const canViewEnquiries = rolePermissions?.enquiries?.display || false; // Adjust based on your permission structure

  const FormsCollectionRef = collection(db, "enquiryForms");
  const EnquiriesCollectionRef = collection(db, "enquiries");
  const LogsCollectionRef = collection(db, "activityLogs");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const logActivity = async (action, details) => {
    if (!user) return;
    try {
      const logDocRef = doc(db, "activityLogs", "currentLog");
      const logEntry = {
        timestamp: serverTimestamp(),
        userId: user.uid,
        userEmail: user.email,
        action,
        details,
      };
      await updateDoc(logDocRef, {
        logs: arrayUnion(logEntry),
        count: increment(1),
      }).catch(async (err) => {
        if (err.code === "not-found") {
          await setDoc(logDocRef, { logs: [logEntry], count: 1 });
        } else {
          throw err;
        }
      });
    } catch (err) {
      // //console.error("Error logging activity:", err.message);
    }
  };

  const fetchEnquiryCounts = useCallback(async () => {
    try {
      const snapshot = await getDocs(EnquiriesCollectionRef);
      const counts = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const formId = data.formId || "unknown";
        counts[formId] = (counts[formId] || 0) + 1;
      });
      setEnquiryCounts(counts);
    } catch (err) {
      console.error("Error fetching enquiry counts:", err.message);
    }
  }, []);

  const fetchForms = useCallback(() => {
    if (!canDisplay) {
      return;
    }
    const q = query(FormsCollectionRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const formData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setForms(formData);
        setSearchResults(formData);
      },
      (err) => {
        console.error("Error fetching forms:", err.message, err.code);
      }
    );
    return unsubscribe;
  }, [canDisplay]);

  const debouncedSearch = useCallback(
    debounce((term) => {
      if (!term.trim()) {
        setSearchResults(forms);
        return;
      }
      const results = forms.filter(
        (form) =>
          form.name?.toLowerCase().includes(term.toLowerCase()) ||
          form.createdBy?.toLowerCase().includes(term.toLowerCase()) ||
          form.role?.toLowerCase().includes(term.toLowerCase())
      );
      setSearchResults(results);
    }, 300),
    [forms]
  );

  useEffect(() => {
    if (!canDisplay) return;
    const unsubscribeForms = fetchForms();
    fetchEnquiryCounts();
    return () => unsubscribeForms && unsubscribeForms();
  }, [fetchForms, fetchEnquiryCounts, canDisplay]);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {

  }, [forms, searchResults]);

  const handleCreateFormClick = () => {
    if (!canCreate) {
      alert("You do not have permission to create enquiry forms.");
      return;
    }
    setCurrentForm(null);
    setIsOpen(true);
  };

  const handleEditClick = (form) => {
    if (!canUpdate) {
      alert("You do not have permission to update enquiry forms.");
      return;
    }
    setCurrentForm(form);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentForm(null);
  };

  const checkEnquiriesInForm = async (formId) => {
    try {
      const q = query(EnquiriesCollectionRef, where("formId", "==", formId));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      console.error("Error checking enquiries in form:", err.message);
      return false;
    }
  };

  const deleteForm = async () => {
    if (!deleteId || !canDelete) {
      if (!canDelete) alert("You do not have permission to delete enquiry forms.");
      return;
    }
    try {
      const hasEnquiries = await checkEnquiriesInForm(deleteId);
      if (hasEnquiries) {
        setDeleteMessage("This form cannot be deleted because enquiries are associated with it.");
        return;
      }
      const formRef = doc(db, "enquiryForms", deleteId);
      const formSnapshot = await getDoc(formRef);
      const formData = formSnapshot.exists() ? formSnapshot.data() : {};
      await deleteDoc(formRef);
      await logActivity("Deleted enquiry form", { name: formData.name || "Unknown" });
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this form? This action cannot be undone.");
    } catch (err) {
      console.error("Error deleting form:", err.message);
      setDeleteMessage("An error occurred while trying to delete the form.");
    }
  };

  if (!canDisplay) {
    return (
      <div className="p-4 text-red-600 text-center">
        Access Denied: You do not have permission to view enquiry forms.
      </div>
    );
  }

  return (
<div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 fixed inset-0 left-[300px]">
  {/* Header */}
  <div className="flex justify-between items-center mb-10">
    <h1 className="text-2xl font-bold text-[#333333] font-sans">Enquiries Form</h1>
    {canCreate && (
      <button
        type="button"
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-md"
        onClick={handleCreateFormClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Enquiry Form
      </button>
    )}
  </div>

  {/* Search Bar and Table Container */}
  <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm">
    <div className="mb-8 flex items-center space-x-4">
      <div className="relative max-w-md w-full">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search forms by name, user, or role..."
          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 shadow-inner"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Forms Table */}
    <div className="rounded-2xl shadow-md max-h-[65vh] overflow-x-auto overflow-y-auto">
      <table className="w-full border-collapse">
        <thead className="bg-gradient-to-r from-indigo-50 to-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Sr No</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Name</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Enquiries Count</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(searchResults.length > 0 || searchTerm.trim() ? searchResults : forms).map((form, index) => (
            <tr key={form.id} className="border-b hover:bg-indigo-50/50 transition-all duration-200">
              <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{form.name || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{enquiryCounts[form.id] || 0}</td>
              <td className="px-6 py-4">
                <div className="relative">
                  <button
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 flex items-center gap-2"
                    onClick={(e) => e.currentTarget.nextElementSibling.focus()}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Actions
                  </button>
                  <FormControl size="small" className="absolute top-0 left-0 opacity-0">
                    <Select
                      value=""
                      onChange={(e) => {
                        const action = e.target.value;
                        if (action === "delete" && canDelete) {
                          setDeleteId(form.id);
                          setOpenDelete(true);
                          setDeleteMessage(
                            "Are you sure you want to delete this form? This action cannot be undone."
                          );
                        } else if (action === "update" && canUpdate) {
                          handleEditClick(form);
                        } else if (action === "view") {
                          handleViewForm(form);
                        } else if (action === "viewEnquiries" && canViewEnquiries) {
                          handleViewEnquiries(form.id);
                        }
                      }}
                      displayEmpty
                      renderValue={() => "Actions"}
                      disabled={!canUpdate && !canDelete && !canViewEnquiries}
                    >
                      <MenuItem value="" disabled>
                        Actions
                      </MenuItem>
                      {canUpdate && <MenuItem value="update">Update</MenuItem>}
                      <MenuItem value="view">View Form</MenuItem>
                      {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                      {canViewEnquiries && <MenuItem value="viewEnquiries">View Enquiries</MenuItem>}
                    </Select>
                  </FormControl>
                </div>
              </td>
            </tr>
          ))}
          {!(searchResults.length > 0 || searchTerm.trim() ? searchResults : forms).length && (
            <tr>
              <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-400">
                No enquiry forms found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Backdrop for Sidebar */}
  {isOpen && (
    <div
      className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
      onClick={handleClose}
    />
  )}

  {/* Sidebar (CreateEnquiryForm) */}
  {isOpen && (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 overflow-y-auto rounded-l-2xl border-l border-gray-100/50 backdrop-blur-sm`}
    >
      <CreateEnquiryForm
        isOpen={isOpen}
        toggleSidebar={handleClose}
        form={currentForm}
        logActivity={logActivity}
      />
    </div>
  )}

  {/* Form Viewer */}
  {selectedForm && (
    <FormViewer form={selectedForm} onClose={handleCloseViewer} />
  )}

  {/* Delete Confirmation Dialog */}
  {canDelete && (
    <div className={`${openDelete ? 'fixed inset-0 bg-black/60 flex justify-center items-center z-50 transition-opacity duration-300' : 'hidden'}`}>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{deleteMessage}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setOpenDelete(false)}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm"
          >
            Cancel
          </button>
          {deleteMessage ===
            "Are you sure you want to delete this form? This action cannot be undone." && (
            <button
              onClick={deleteForm}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2.5 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-sm"
            >
              Yes, Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )}
</div>
  );
}