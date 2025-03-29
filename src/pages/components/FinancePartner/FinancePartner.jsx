import { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { getDocs, collection, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import AddFinancePartner from "./AddFinancePartner.jsx";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { Select, MenuItem, FormControl } from "@mui/material";
import { useAuth } from "../../../context/AuthContext"; // Adjust the import path as needed
import { useNavigate } from "react-router-dom";

export default function FinancePartner() {
  const navigate = useNavigate();
  const { rolePermissions } = useAuth(); // Fetch permissions from useAuth hook
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

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
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
  };

  useEffect(() => {
    if (searchTerm) handleSearch();
    else setSearchResults([]);
  }, [searchTerm, partners]);

  const fetchPartners = async () => {
    try {
      const q = query(PartnerCollectionRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const partnerData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartners(partnerData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching partners:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized"); // Redirect if user can't view this page
      return;
    }
    fetchPartners();
  }, [canDisplay, navigate]);

  const handleCreatePartnerClick = () => {
    if (!canCreate) return; // Prevent creation if no permission
    setCurrentPartner(null);
    toggleSidebar();
  };

  const handleEditClick = (partner) => {
    if (!canUpdate) return; // Prevent editing if no permission
    setCurrentPartner(partner);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentPartner(null);
    fetchPartners();
  };

  const deletePartner = async () => {
    if (!canDelete || !deleteId) return; // Prevent deletion if no permission
    try {
      await deleteDoc(doc(db, "FinancePartner", deleteId));
      fetchPartners();
      setOpenDelete(false);
      setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
    } catch (err) {
      console.error("Error deleting partner:", err);
      setDeleteMessage("An error occurred while trying to delete the partner.");
    }
  };

  if (!canDisplay) return null; // Render nothing if no display permission

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Finance Partners</h1>
        {canCreate && (
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            onClick={handleCreatePartnerClick}
          >
            + Add Finance Partner
          </button>
        )}
      </div>

      {/* Search Bar and Table Container */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners by name or contact..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Partners Table */}
        <div className="rounded-lg shadow-md overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Partner Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Contact Persons</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                {(canUpdate || canDelete) && (
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
                <tr key={partner.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-800">{partner.name || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {partner.contactPersons && partner.contactPersons.length > 0 ? (
                      <ul className="list-disc pl-4 text-sm">
                        {partner.contactPersons.map((contact, idx) => (
                          <li key={idx}>
                            {contact.name} ({contact.mobile}, {contact.email})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {partner.address && Object.values(partner.address).some((val) => val) ? (
                      `${partner.address.street || ""} ${partner.address.area || ""}, 
                      ${partner.address.city || ""}, ${partner.address.state || ""}, 
                      ${partner.address.country || ""} ${partner.address.postalCode || ""}`
                        .replace(/,\s*,/g, ",")
                        .replace(/^\s*,|\s*$/g, "")
                        .trim() || "N/A"
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{partner.status || "Active"}</td>
                  {(canUpdate || canDelete) && (
                    <td className="px-4 py-3">
                      <FormControl size="small">
                        <Select
                          value=""
                          onChange={(e) => {
                            const action = e.target.value;
                            if (action === "edit" && canUpdate) {
                              handleEditClick(partner);
                            } else if (action === "delete" && canDelete) {
                              setDeleteId(partner.id);
                              setOpenDelete(true);
                              setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
                            }
                          }}
                          displayEmpty
                          renderValue={() => "Actions"}
                          className="text-sm"
                        >
                          <MenuItem value="" disabled>
                            Actions
                          </MenuItem>
                          {canUpdate && <MenuItem value="edit">Edit</MenuItem>}
                          {canDelete && <MenuItem value="delete">Delete</MenuItem>}
                        </Select>
                      </FormControl>
                    </td>
                  )}
                </tr>
              ))}
              {(searchResults.length > 0 ? searchResults : partners).length === 0 && (
                <tr>
                  <td colSpan={canUpdate || canDelete ? 6 : 5} className="px-4 py-3 text-center text-gray-500">
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
          } z-50 overflow-y-auto`}
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
        <Dialog
          open={openDelete}
          handler={() => setOpenDelete(false)}
          className="rounded-lg shadow-lg"
        >
          <DialogHeader className="text-gray-800 font-semibold">Confirm Deletion</DialogHeader>
          <DialogBody className="text-gray-600">{deleteMessage}</DialogBody>
          <DialogFooter className="space-x-4">
            <Button
              variant="text"
              color="gray"
              onClick={() => setOpenDelete(false)}
            >
              Cancel
            </Button>
            {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
              <Button
                variant="filled"
                color="red"
                onClick={deletePartner}
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