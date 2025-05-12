import { useState, useEffect } from "react";
import { db } from "../../../../config/firebase.js";
import { getDocs, collection, deleteDoc, doc, query, orderBy, addDoc } from "firebase/firestore";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";
import { useAuth } from "../../../../context/AuthContext.jsx";
import AddCompanies from "./AddCompanies.jsx";
import AddBulkCompanies from "./AddBulkCompanies.jsx";
import { useNavigate } from "react-router-dom";
import CompanyModal from "./CompanyModal/CompanyModal.jsx";

export default function Companies() {
    const navigate = useNavigate();
    const { user, rolePermissions } = useAuth();
    const [currentCompany, setCurrentCompany] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddSingleOpen, setIsAddSingleOpen] = useState(false);
    const [isAddBulkOpen, setIsAddBulkOpen] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this company? This action cannot be undone.");
    const [openAddOptions, setOpenAddOptions] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const CompanyCollectionRef = collection(db, "Companies");

    const canCreate = rolePermissions?.Companies?.create || false;
    const canUpdate = rolePermissions?.Companies?.update || false;
    const canDelete = rolePermissions?.Companies?.delete || false;
    const canDisplay = rolePermissions?.Companies?.display || false;

    const logActivity = async (action, details) => {
      try {
        const activityLog = {
          action,
          details,
          timestamp: new Date().toISOString(),
          userEmail: user?.email || "anonymous",
          userId: user.uid,
        };
        await addDoc(collection(db, "activityLogs"), activityLog);
      } catch (error) {
        console.error("Error logging activity:", error);
      }
    };

    const toggleAddSingleSidebar = () => setIsAddSingleOpen((prev) => !prev);
    const toggleAddBulkSidebar = () => setIsAddBulkOpen((prev) => !prev);

    const handleSearch = (e) => {
      if (e) e.preventDefault();
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }
      const results = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (company.pointsOfContact &&
            company.pointsOfContact.some(
              (contact) =>
                contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contact.mobile.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
      setSearchResults(results);
    };

    useEffect(() => {
      if (searchTerm) handleSearch();
      else setSearchResults([]);
    }, [searchTerm, companies]);

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const q = query(CompanyCollectionRef, orderBy("createdAt", "asc"));
        const snapshot = await getDocs(q);
        const companyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompanies(companyData);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (!canDisplay) {
        navigate("/unauthorized");
        return;
      }
      fetchCompanies();
    }, [canDisplay, navigate]);

    const handleAddCompanyClick = () => {
      if (!canCreate) return;
      setOpenAddOptions(true);
      logActivity("OPEN_ADD_OPTIONS", {});
    };

    const handleEditClick = (company) => {
      if (!canUpdate) return;
      setCurrentCompany(company);
      setIsAddSingleOpen(true);
    };

    const handleDeleteClick = (companyId) => {
      if (!canDelete) return;
      setDeleteId(companyId);
      setOpenDelete(true);
    };

    const handleRowClick = (company) => {
      if (!canDisplay) return;
      setSelectedCompany(company);
      setIsModalOpen(true);
      logActivity("VIEW_COMPANY_DETAILS", { companyId: company.id });
    };

    const handleCloseSingle = () => {
      setIsAddSingleOpen(false);
      setCurrentCompany(null);
      fetchCompanies();
    };

    const handleCloseBulk = () => {
      setIsAddBulkOpen(false);
      fetchCompanies();
    };

    const deleteCompany = async () => {
      if (!canDelete || !deleteId) return;
      try {
        await deleteDoc(doc(db, "Companies", deleteId));
        fetchCompanies();
        setOpenDelete(false);
        setDeleteMessage("Are you sure you want to delete this company? This action cannot be undone.");
        logActivity("DELETE_COMPANY", { companyId: deleteId });
      } catch (err) {
        console.error("Error deleting company:", err);
        setDeleteMessage("An error occurred while trying to delete the company.");
      }
    };

    if (!canDisplay) return null;

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 p-4 fixed inset-0 left-[300px]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Companies</h1>
          {canCreate && (
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
              onClick={handleAddCompanyClick}
            >
              + Add Company
            </button>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies by name or contact..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="rounded-lg shadow-md overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Sr No</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Name</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Domain</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Phone</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Email</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">City</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">URL</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Hiring Period</th>
                  <th className="px-4 py-3 text-left text-base font-semibold text-gray-700 min-w-52">Company Type</th>
                  {(canUpdate || canDelete) && (
                    <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(searchResults.length > 0 ? searchResults : companies).map((company, index) => (
                  <tr
                    key={company.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(company)}
                  >
                    <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-800">{company.name || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.domain || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.phone || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.email || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.city || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.url || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.toDate|| "N/A"} to {company.fromDate|| "N/A"}</td>
                    <td className="px-4 py-3 text-gray-800">{company.companyType || "N/A"}</td>
                    {(canUpdate || canDelete) && (
                      <td className="px-4 py-3 text-gray-800" onClick={(e) => e.stopPropagation()}>
                        {canUpdate && (
                          <button
                            onClick={() => handleEditClick(company)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(company.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {(searchResults.length > 0 ? searchResults : companies).length === 0 && (
                  <tr>
                    <td colSpan={(canUpdate || canDelete) ? 10 : 9} className="px-4 py-3 text-center text-gray-500">
                      No companies found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Backdrop for Sidebar */}
        {(canCreate || canUpdate) && (isAddSingleOpen || isAddBulkOpen) && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={isAddSingleOpen ? handleCloseSingle : handleCloseBulk}
          />
        )}

        {/* Sidebar (AddCompanies) */}
        {(canCreate || canUpdate) && (
          <AddCompanies
            isOpen={isAddSingleOpen}
            toggleSidebar={handleCloseSingle}
            company={currentCompany}
          />
        )}

        {/* Sidebar (AddBulkCompanies) */}
        {canCreate && (
          <AddBulkCompanies
            isOpen={isAddBulkOpen}
            toggleSidebar={handleCloseBulk}
          />
        )}

        {/* Company Modal */}
        {canDisplay && (
          <CompanyModal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            company={selectedCompany}
            rolePermissions={rolePermissions}
          />
        )}

        {/* Add Options Dialog */}
        {canCreate && openAddOptions && (
          <Dialog
            open={openAddOptions}
            handler={() => setOpenAddOptions(false)}
            className="rounded-lg shadow-lg"
          >
            <DialogHeader className="text-gray-800 font-semibold">Add Company</DialogHeader>
            <DialogBody className="text-gray-600">Choose how you want to add a company:</DialogBody>
            <DialogFooter className="space-x-4">
              <Button
                variant="text"
                color="gray"
                onClick={() => setOpenAddOptions(false)}
              >
                Cancel
              </Button>
              <Button
                variant="filled"
                color="blue"
                onClick={() => {
                  setOpenAddOptions(false);
                  setIsAddSingleOpen(true);
                  logActivity("SELECT_ADD_SINGLE", {});
                }}
              >
                Add Single Company
              </Button>
              <Button
                variant="filled"
                color="green"
                onClick={() => {
                  setOpenAddOptions(false);
                  setIsAddBulkOpen(true);
                  logActivity("SELECT_ADD_BULK", {});
                }}
              >
                Add Bulk Companies
              </Button>
            </DialogFooter>
          </Dialog>
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
              {deleteMessage === "Are you sure you want to delete this company? This action cannot be undone." && (
                <Button
                  variant="filled"
                  color="red"
                  onClick={deleteCompany}
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