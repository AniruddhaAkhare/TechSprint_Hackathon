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
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Enquiries Form</h1>
        {canCreate && (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700"
            onClick={handleCreateFormClick}
          >
            + Create Enquiry Form
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search forms by name, user, or role..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="rounded-lg shadow-md max-h-[70vh] overflow-x-auto overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Form Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Enquiries Count</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 || searchTerm.trim() ? searchResults : forms).map((form, index) => (
                <tr key={form.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{form.name || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">{enquiryCounts[form.id] || 0}</td>
                  <td className="px-4 py-3">
                    <FormControl size="small">
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
                  </td>
                </tr>
              ))}
              {!(searchResults.length > 0 || searchTerm.trim() ? searchResults : forms).length && (
                <tr>
                  <td colSpan="5" className="px-4 py-3 text-center text-gray-600">
                    No enquiry forms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      )}

      {isOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg transform transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } z-50 overflow-y-auto`}
        >
          <CreateEnquiryForm
            isOpen={isOpen}
            toggleSidebar={handleClose}
            form={currentForm}
            logActivity={logActivity}
          />
        </div>
      )}

      {selectedForm && (
        <FormViewer form={selectedForm} onClose={handleCloseViewer} />
      )}

      {canDelete && (
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg w-96 max-w-[90%] mx-auto"
        >
          <DialogHeader className="text-gray-800 font-semibold text-lg p-4">
            Confirm Deletion
          </DialogHeader>
          <DialogBody className="text-gray-600 text-base p-4">{deleteMessage}</DialogBody>
          <DialogFooter className="space-x-4 p-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
              className="text-sm"
            >
              Cancel
            </Button>
            {deleteMessage ===
              "Are you sure you want to delete this form? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deleteForm}
                className="text-sm"
              >
                Yes, Delete
              </Button>
            )}
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}