import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc } from "firebase/firestore";
import AddFinancePartner from "./AddFinancePartner.jsx";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FinancePartner() {
  const navigate = useNavigate();
  const { user, rolePermissions } = useAuth();
  const [currentPartner, setCurrentPartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this partner? This action cannot be undone.");

  const PartnerCollectionRef = collection(db, "FinancePartner");

  // Define permissions for FinancePartner
  const canCreate = rolePermissions?.FinancePartner?.create || false;
  const canUpdate = rolePermissions?.FinancePartner?.update || false;
  const canDelete = rolePermissions?.FinancePartner?.delete || false;
  const canDisplay = rolePermissions?.FinancePartner?.display || false;

  // Activity logging function
  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details,
        timestamp: new Date().toISOString(),
        userEmail: user?.email || 'anonymous',
        userId: user.uid
      };
      await addDoc(collection(db, 'activityLogs'), activityLog);
    } catch (error) {
      // //console.error('Error logging activity:', error);
    }
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      // logActivity('SEARCH_PARTNERS', { searchTerm: '', resultCount: 0 });
      return;
    }
    const results = partners.filter(
      (partner) =>
        partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.contactPersons.some(
          (contact) =>
            contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.mobile.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setSearchResults(results);
    // logActivity('SEARCH_PARTNERS', { searchTerm, resultCount: results.length });
  };

  useEffect(() => {
    if (searchTerm) handleSearch();
    else setSearchResults([]);
  }, [searchTerm, partners]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const q = query(PartnerCollectionRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const partnerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartners(partnerData);
      // logActivity('FETCH_PARTNERS_SUCCESS', { count: partnerData.length });
    } catch (err) {
      // //console.error("Error fetching partners:", err);
      // logActivity('FETCH_PARTNERS_ERROR', { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      // logActivity('UNAUTHORIZED_ACCESS_ATTEMPT', { page: 'FinancePartner' });
      navigate("/unauthorized");
      return;
    }
    fetchPartners();
  }, [canDisplay, navigate]);

  const handleCreatePartnerClick = () => {
    if (!canCreate) {
      // logActivity('UNAUTHORIZED_CREATE_ATTEMPT', { action: 'createFinancePartner' });
      return;
    }
    setCurrentPartner(null);
    toggleSidebar();
    // logActivity('OPEN_CREATE_PARTNER', {});
  };

  const handleEditClick = (partner) => {
    if (!canUpdate) {
      // logActivity('UNAUTHORIZED_UPDATE_ATTEMPT', { action: 'editFinancePartner', partnerId: partner.id });
      return;
    }
    setCurrentPartner(partner);
    setIsOpen(true);
    // logActivity('OPEN_EDIT_PARTNER', { partnerId: partner.id });
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentPartner(null);
    fetchPartners();
    // logActivity('CLOSE_PARTNER_SIDEBAR', {});
  };

  const deletePartner = async () => {
    if (!canDelete || !deleteId) {
      // logActivity('UNAUTHORIZED_DELETE_ATTEMPT', { action: 'deleteFinancePartner', partnerId: deleteId });
      return;
    }
    try {
      await deleteDoc(doc(db, "FinancePartner", deleteId));
      fetchPartners();
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
      logActivity('DELETE PARTNER SUCCESS', { partnerId: deleteId });
    } catch (err) {
      // //console.error("Error deleting partner:", err);
      setDeleteMessage("An error occurred while trying to delete the partner.");
      // logActivity('DELETE_PARTNER_ERROR', { partnerId: deleteId, error: err.message });
    }
  };

  if (!canDisplay) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  return (
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
  {/* Header */}
  <div className="flex justify-between items-center mb-8">
    <h1 className="text-2xl font-bold text-[#333333] font-sans">Finance Partners</h1>
    {canCreate && (
      <button
        type="button"
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 mr-8"
        onClick={handleCreatePartnerClick}
      >
        + Add Finance Partner
      </button>
    )}
  </div>

  {/* Search Bar and Table Container */}
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div className="mb-6">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search partners by name or contact..."
        className="w-full max-w-md px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200"
      />
    </div>

    {/* Partners Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
              Sr No
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[200px]">
              Partner Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[300px]">
              Contact Persons
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[300px]">
              Address
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
              Status
            </th>
            {(canUpdate || canDelete) && (
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
            <tr key={partner.id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{partner.name || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {partner.contactPersons && partner.contactPersons.length > 0 ? (
                  <ul className="list-disc pl-4 text-sm space-y-1">
                    {partner.contactPersons.map((contact, idx) => (
                      <li key={idx}>
                        {contact.name} ({contact.mobile}, {contact.email})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {partner.address && Object.values(partner.address).some((val) => val) ? (
                  <span>
                    {`${partner.address.street || ""} ${partner.address.area || ""}, 
                    ${partner.address.city || ""}, ${partner.address.state || ""}, 
                    ${partner.address.country || ""} ${partner.address.postalCode || ""}`
                      .replace(/,\s*,/g, ",")
                      .replace(/^\s*,|\s*$/g, "")
                      .trim() || "N/A"}
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{partner.status || "Active"}</td>
              {(canUpdate || canDelete) && (
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-3">
                    {canUpdate && (
                      <button
                        onClick={() => handleEditClick(partner)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition duration-150"
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => {
                          setDeleteId(partner.id);
                          setOpenDelete(true);
                          setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
                          // logActivity('INITIATE_DELETE_PARTNER', { partnerId: partner.id });
                        }}
                        className="text-red-600 hover:text-red-800 font-medium transition duration-150"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {(searchResults.length > 0 ? searchResults : partners).length === 0 && (
            <tr>
              <td colSpan={canUpdate || canDelete ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                No finance partners found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Backdrop for Sidebar */}
  {(canCreate || canUpdate) && isOpen && (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={handleClose}
    />
  )}

  {/* Sidebar (AddFinancePartner) */}
  {(canCreate || canUpdate) && (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 overflow-y-auto rounded-l-xl border-l border-gray-100`}
    >
      <AddFinancePartner
        isOpen={isOpen}
        toggleSidebar={handleClose}
        partner={currentPartner}
      />
    </div>
  )}

  {/* Delete Confirmation Dialog */}
  {canDelete && openDelete && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6">{deleteMessage}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setOpenDelete(false);
              // logActivity('CANCEL_DELETE_PARTNER', { partnerId: deleteId });
            }}
            className="px-5 py-2.5 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-200 font-medium"
          >
            Cancel
          </button>
          {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
            <button
              onClick={deletePartner}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-red-700 hover:to-red-800 transition duration-200 font-medium"
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