// import { useState, useEffect } from "react";
// import { db } from '../../../config/firebase';
// import { getDocs, collection, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
// import AddFinancePartner from "./AddFinancePartner.jsx"; // Assuming you have a similar component
// import SearchBar from "../SearchBar";
// import { Dialog, DialogHeader, DialogBody, DialogFooter, Button } from "@material-tailwind/react";

// export default function FinancePartner() {
//     const [currentPartner, setCurrentPartner] = useState(null);
//     const [partners, setPartners] = useState([]);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
    
//     const PartnerCollectionRef = collection(db, "FinancePartner"); // Adjusted collection name
//     const [isOpen, setIsOpen] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);
//     const [deleteMessage, setDeleteMessage] = useState("Are you sure you want to delete this partner? This action cannot be undone.");

//     const toggleSidebar = () => setIsOpen(prev => !prev);

//     const handleSearch = (e) => {
//         if (e) e.preventDefault();
//         if (!searchTerm.trim()) {
//             setSearchResults([]);
//             return;
//         }
//         const results = partners.filter(partner =>
//             partner.name.toLowerCase().includes(searchTerm.toLowerCase())
//         );
//         setSearchResults(results);
//     };

//     useEffect(() => {
//         if (searchTerm) handleSearch();
//         else setSearchResults([]);
//     }, [searchTerm]);

//     const fetchPartners = async () => {
//         try {
//             const q = query(PartnerCollectionRef, orderBy('createdAt', 'asc'));
//             const snapshot = await getDocs(q);
//             const partnerData = snapshot.docs.map(doc => ({
//                 id: doc.id,
//                 ...doc.data(),
//             }));
//             setPartners(partnerData);
//             console.log("Partners fetched:", partnerData);
//         } catch (err) {
//             console.error("Error fetching partners:", err);
//         }
//     };

//     useEffect(() => {
//         fetchPartners();
//     }, []);

//     const handleCreatePartnerClick = () => {
//         setCurrentPartner(null);
//         toggleSidebar();
//     };

//     const handleEditClick = (partner) => {
//         setCurrentPartner(partner);
//         setIsOpen(true);
//     };

//     const handleClose = () => {
//         setIsOpen(false);
//         setCurrentPartner(null);
//         fetchPartners();
//     };

//     const deletePartner = async () => {
//         if (!deleteId) return;

//         try {
//             await deleteDoc(doc(db, "FinancePartner", deleteId));
//             console.log(`Partner ${deleteId} deleted successfully`);
//             fetchPartners();
//             setOpenDelete(false);
//             setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone."); // Reset message
//         } catch (err) {
//             console.error("Error deleting partner:", err);
//             setDeleteMessage("An error occurred while trying to delete the partner.");
//         }
//     };

//     return (
//         <div className="flex-col w-screen ml-80 p-4">
//             <div className="justify-between items-center p-4 mb-4 flex">
//                 <div className="flex-1">
//                     <h1 className="text-2xl font-semibold">Finance Partners</h1>
//                 </div>
//                 <div>
//                     <button
//                         type="button"
//                         className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
//                         onClick={handleCreatePartnerClick}
//                     >
//                         + Add Finance Partner
//                     </button>
//                 </div>
//             </div>

//             <CreateFinancePartner isOpen={isOpen} toggleSidebar={handleClose} partner={currentPartner} />

//             <div className="justify-between items-center p-4 mt-4">
//                 <SearchBar
//                     searchTerm={searchTerm}
//                     setSearchTerm={setSearchTerm}
//                     handleSearch={handleSearch}
//                 />
//             </div>

//             <div className="sec-3">
//                 <table className="data-table table w-full">
//                     <thead className="table-secondary">
//                         <tr>
//                             <th>Sr No</th>
//                             <th>Partner Name</th>
//                             <th>Contact Info</th>
//                             <th>Status</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
//                             <tr key={partner.id}>
//                                 <td>{index + 1}</td>
//                                 <td>{partner.name}</td>
//                                 <td>{partner.contact || "N/A"}</td> {/* Assuming contact field */}
//                                 <td>{partner.status || "Active"}</td>
//                                 <td>
//                                     <div className="flex items-center space-x-2">
//                                         <button 
//                                             onClick={() => {
//                                                 setDeleteId(partner.id);
//                                                 setOpenDelete(true);
//                                                 setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
//                                             }} 
//                                             className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
//                                         >
//                                             Delete
//                                         </button>
//                                         <button 
//                                             onClick={() => handleEditClick(partner)} 
//                                             className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
//                                         >
//                                             Update
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <Dialog open={openDelete} handler={() => setOpenDelete(false)}>
//                 <DialogHeader>Confirm Deletion</DialogHeader>
//                 <DialogBody>{deleteMessage}</DialogBody>
//                 <DialogFooter>
//                     <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
//                     {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
//                         <Button variant="filled" color="red" onClick={deletePartner}>Yes, Delete</Button>
//                     )}
//                 </DialogFooter>
//             </Dialog>
//         </div>
//     );
// }


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // If using navigation
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
      partner.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  useEffect(() => {
    if (searchTerm) handleSearch();
    else setSearchResults([]);
  }, [searchTerm]);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex-col w-screen ml-80 p-4">
      <div className="justify-between items-center p-4 mb-4 flex">
        <h1 className="text-2xl font-semibold">Finance Partners</h1>
        <button
          type="button"
          className="btn btn-primary bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          onClick={handleCreatePartnerClick}
        >
          + Add Finance Partner
        </button>
      </div>

      <AddFinancePartner isOpen={isOpen} toggleSidebar={handleClose} partner={currentPartner} />

      <div className="justify-between items-center p-4 mt-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
        />
      </div>

      <div className="sec-3">
        <table className="data-table table w-full">
          <thead className="table-secondary">
            <tr>
              <th>Sr No</th>
              <th>Partner Name</th>
              <th>Contact Info</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(searchResults.length > 0 ? searchResults : partners).map((partner, index) => (
              <tr key={partner.id}>
                <td>{index + 1}</td>
                <td>{partner.name}</td>
                <td>{partner.contact || "N/A"}</td>
                <td>{partner.status || "Active"}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setDeleteId(partner.id);
                        setOpenDelete(true);
                        setDeleteMessage("Are you sure you want to delete this partner? This action cannot be undone.");
                      }}
                      className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditClick(partner)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600"
                    >
                      Update
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
          <Button variant="text" color="gray" onClick={() => setOpenDelete(false)}>Cancel</Button>
          {deleteMessage === "Are you sure you want to delete this partner? This action cannot be undone." && (
            <Button variant="filled" color="red" onClick={deletePartner}>Yes, Delete</Button>
          )}
        </DialogFooter>
      </Dialog>
    </div>
  );
}