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
 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
  {/* Header */}
  <div className="flex justify-between items-center mb-10">
    <h1 className="text-2xl font-bold text-[#333333]  font-sans tracking-tight">Finance Partners</h1>
    {canCreate && (
      <button
        type="button"
        className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transform hover:scale-105 transition-all duration-200 flex items-center gap-2 shadow-md mr-10"
        onClick={handleCreatePartnerClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Finance Partner
      </button>
    )}
  </div>

  {/* Search Bar and Table Container */}
  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100/50 backdrop-blur-sm">
    <div className="mb-8">
      <div className="relative max-w-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search partners by name or contact..."
          className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 placeholder-gray-400 shadow-inner"
        />
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    {/* Partners Table */}
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gradient-to-r from-indigo-50 to-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
              Sr No
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[200px]">
              Partner Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[300px]">
              Contact Persons
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[300px]">
              Address
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">
              Status
            </th>
            {(canUpdate || canDelete) && (
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                Action
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
            <tr key={partner.id} className="hover:bg-indigo-50/50 transition-all duration-200">
              <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
              <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{partner.name || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {partner.contactPersons && partner.contactPersons.length > 0 ? (
                  <ul className="list-disc pl-4 text-sm space-y-1.5">
                    {partner.contactPersons.map((contact, idx) => (
                      <li key={idx} className="text-gray-600">
                        {contact.name} ({contact.mobile}, <a href={`mailto:${contact.email}`} className="text-indigo-600 hover:underline">{contact.email}</a>)
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
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
                  <span className="text-gray-400">N/A</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  partner.status === "Active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {partner.status || "Active"}
                </span>
              </td>
              {(canUpdate || canDelete) && (
              <td className="px-6 py-4 text-sm">
  <div className="flex gap-3">
    {canUpdate && (
      <button
        onClick={() => handleEditClick(partner)}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs hover:bg-indigo-700 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
        Edit
      </button>
    )}
    {canDelete && (
      <button
        onClick={() => {
          setDeleteId(partner.id);
          setOpenDelete(true);
          setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
        }}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md text-xs hover:bg-red-700 transition-all"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
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
              <td colSpan={canUpdate || canDelete ? 6 : 5} className="px-6 py-8 text-center text-sm text-gray-400">
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
      className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
      onClick={handleClose}
    />
  )}

  {/* Sidebar (AddFinancePartner) */}
  {(canCreate || canUpdate) && (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-3/4 md:w-2/5 bg-white shadow-2xl transform transition-transform duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 overflow-y-auto rounded-l-2xl border-l border-gray-100/50 backdrop-blur-sm`}
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
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 transition-opacity duration-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100/50 backdrop-blur-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-5 tracking-tight">Confirm Deletion</h2>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{deleteMessage}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => {
              setOpenDelete(false);
            }}
            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium shadow-sm"
          >
            Cancel
          </button>
          {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
            <button
              onClick={deletePartner}
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