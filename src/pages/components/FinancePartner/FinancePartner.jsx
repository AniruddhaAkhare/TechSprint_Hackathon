import { useState, useEffect } from "react";
import { db } from '../../../config/firebase';
import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import AddFinancePartner from "./AddFinancePartner.jsx";
import SearchBar from "../SearchBar";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

export default function FinancePartner() {
  const [currentPartner, setCurrentPartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this partner? This action cannot be undone.");

  const PartnerCollectionRef = collection(db, "FinancePartner");

  const toggleSidebar = () => setIsOpen(prev => !prev);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const results = partners.filter(partner =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.contactPersons.some(contact => 
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
      const q = query(PartnerCollectionRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);
      const partnerData = snapshot.docs.map(doc => ({
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
    fetchPartners();
  }, []);

  const handleCreatePartnerClick = () => {
    setCurrentPartner(null);
    toggleSidebar();
  };

  const handleEditClick = (partner) => {
    setCurrentPartner(partner);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentPartner(null);
    fetchPartners();
  };

  const deletePartner = async () => {
    if (!deleteId) return;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">Loading...</div>
    );
  }

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="flex justify-between items-center p-4 mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Finance Partners</h1>
        <button
          type="button"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          onClick={handleCreatePartnerClick}
        >
          + Add Finance Partner
        </button>
      </div>

      <AddFinancePartner isOpen={isOpen} toggleSidebar={handleClose} partner={currentPartner} />

      <div className="p-4 mt-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-medium text-gray-700">Sr No</th>
              <th className="p-3 text-sm font-medium text-gray-700">Partner Name</th>
              <th className="p-3 text-sm font-medium text-gray-700">Contact Persons</th>
              <th className="p-3 text-sm font-medium text-gray-700">Address</th>
              <th className="p-3 text-sm font-medium text-gray-700">Status</th>
              <th className="p-3 text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
              <tr key={partner.id} className="border-b hover:bg-gray-50">
                <td className="p-3 text-gray-600">{index + 1}</td>
                <td className="p-3 text-gray-600">{partner.name}</td>
                <td className="p-3 text-gray-600">
                  {partner.contactPersons && partner.contactPersons.length > 0 ? (
                    <ul className="list-disc pl-4">
                      {partner.contactPersons.map((contact, idx) => (
                        <li key={idx} className="text-sm">
                          {contact.name} ({contact.mobile}, {contact.email})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3 text-gray-600">
                  {partner.address && Object.values(partner.address).some(val => val) ? (
                    `${partner.address.street || ''} ${partner.address.area || ''}, 
                    ${partner.address.city || ''}, ${partner.address.state || ''}, 
                    ${partner.address.country || ''} ${partner.address.postalCode || ''}`
                      .replace(/,\s*,/g, ',')
                      .replace(/^\s*,|\s*$/g, '')
                      .trim() || "N/A"
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="p-3 text-gray-600">{partner.status || "Active"}</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setDeleteId(partner.id);
                        setOpenDelete(true);
                        setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
                      }}
                      className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(partner)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>{deleteMessage}</DialogBody>
        <DialogFooter>
          <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>
            Cancel
          </Button>
          {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
            <Button variant="filled" color="red" onClick={deletePartner}>
              Yes, Delete
            </Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}