// import React, { useState, useEffect } from "react";
// import { db } from "../../../config/firebase";
// import {
//   getDocs,
//   collection,
//   addDoc,
//   updateDoc,
//   doc,
//   serverTimestamp,
// } from "firebase/firestore";
// import { useNavigate } from "react-router-dom";

// const AddFinancePartner = ({ isOpen, toggleSidebar, partner }) => {
//   const navigate = useNavigate();
//   const [partners, setPartners] = useState([]);
//   const [contacts, setContacts] = useState([]); // For contact persons or related entities
//   const [agreements, setAgreements] = useState([]); // For partnership agreements

//   const [partnerName, setPartnerName] = useState("");
//   const [partnerDescription, setPartnerDescription] = useState("");
//   const [contactInfo, setContactInfo] = useState(""); // e.g., email or phone
//   const [partnershipType, setPartnershipType] = useState("");
//   const [partnerStatus, setPartnerStatus] = useState("Active");

//   const [selectedContacts, setSelectedContacts] = useState([]); // List of contact IDs
//   const [selectedAgreements, setSelectedAgreements] = useState([]); // List of agreement IDs
//   const [transactionCount, setTransactionCount] = useState(0); // Total transactions with partner

//   const [availableContacts, setAvailableContacts] = useState([]);
//   const [availableAgreements, setAvailableAgreements] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const contactSnapshot = await getDocs(collection(db, "student")); // Adjust collection name as needed
//       const contactsList = contactSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setContacts(contactsList);
//       setAvailableContacts(contactsList);

//       const agreementSnapshot = await getDocs(collection(db, "Agreements")); // Adjust collection name as needed
//       const agreementsList = agreementSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setAgreements(agreementsList);
//       setAvailableAgreements(agreementsList.filter(agreement => agreement.status === "Active" || !agreement.status));

//       if (partner) {
//         // Fetch transaction count for the partner
//         const transactionSnapshot = await getDocs(collection(db, `FinancePartner/${partner.id}/Transactions`));
//         setTransactionCount(transactionSnapshot.docs.length);
//       }
//     };
//     fetchData();
//   }, [partner]);

//   useEffect(() => {
//     if (partner) {
//       setPartnerName(partner.name);
//       setPartnerDescription(partner.description);
//       setContactInfo(partner.contact);
//       setPartnershipType(partner.type);
//       setPartnerStatus(partner.status || "Active");
//       setSelectedContacts(partner.contacts || []);
//       setSelectedAgreements(partner.agreements || []);
//       setAvailableContacts(contacts.filter(c => !partner.contacts?.includes(c.id)));
//       setAvailableAgreements(agreements.filter(a => (a.status === "Active" || !a.status) && !partner.agreements?.includes(a.id)));
//     }
//   }, [partner, contacts, agreements]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const partnerData = {
//       name: partnerName,
//       description: partnerDescription,
//       contact: contactInfo,
//       type: partnershipType,
//       status: partnerStatus,
//       contacts: selectedContacts, // Array of contact IDs
//       agreements: selectedAgreements, // Array of agreement IDs
//       createdAt: serverTimestamp(),
//     };

//     try {
//       if (partner) {
//         await updateDoc(doc(db, "FinancePartner", partner.id), partnerData);
//         alert("Finance Partner updated successfully!");
//       } else {
//         await addDoc(collection(db, "FinancePartner"), partnerData);
//         alert("Finance Partner added successfully!");
//       }
//       resetForm();
//       toggleSidebar();
//     } catch (error) {
//       console.error("Error saving finance partner:", error);
//       alert("Failed to save finance partner. Please try again.");
//     }
//   };

//   const resetForm = () => {
//     setPartnerName("");
//     setPartnerDescription("");
//     setContactInfo("");
//     setPartnershipType("");
//     setPartnerStatus("Active");
//     setSelectedContacts([]);
//     setSelectedAgreements([]);
//     setTransactionCount(0);
//     setAvailableContacts(contacts);
//     setAvailableAgreements(agreements.filter(agreement => agreement.status === "Active" || !agreement.status));
//   };

//   const handleAddContact = (contactId) => {
//     if (contactId && !selectedContacts.includes(contactId)) {
//       setSelectedContacts([...selectedContacts, contactId]);
//       setAvailableContacts(availableContacts.filter(c => c.id !== contactId));
//     }
//   };

//   const handleRemoveContact = (contactId) => {
//     setSelectedContacts(selectedContacts.filter(id => id !== contactId));
//     const removedContact = contacts.find(c => c.id === contactId);
//     if (removedContact) setAvailableContacts([...availableContacts, removedContact]);
//   };

//   const handleAddAgreement = (agreementId) => {
//     if (agreementId && !selectedAgreements.includes(agreementId)) {
//       setSelectedAgreements([...selectedAgreements, agreementId]);
//       setAvailableAgreements(availableAgreements.filter(a => a.id !== agreementId));
//     }
//   };

//   const handleRemoveAgreement = (agreementId) => {
//     setSelectedAgreements(selectedAgreements.filter(id => id !== agreementId));
//     const removedAgreement = agreements.find(a => a.id === agreementId);
//     if (removedAgreement && (removedAgreement.status === "Active" || !removedAgreement.status)) {
//       setAvailableAgreements([...availableAgreements, removedAgreement]);
//     }
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
//         isOpen ? "translate-x-0" : "translate-x-full"
//       } p-4 overflow-y-auto`}
//     >
//       <button 
//         type="button" 
//         onClick={toggleSidebar} 
//         className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
//       >
//         Back
//       </button>
//       <h1>{partner ? "Edit Finance Partner" : "Add Finance Partner"}</h1>

//       <form onSubmit={handleSubmit}>
//         <label htmlFor="partnerName">Partner Name:</label>
//         <input 
//           type="text" 
//           value={partnerName} 
//           placeholder="Partner Name" 
//           onChange={(e) => setPartnerName(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="partnerDescription">Partner Description</label>
//         <input 
//           type="text" 
//           value={partnerDescription} 
//           placeholder="Partner Description" 
//           onChange={(e) => setPartnerDescription(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="contactInfo">Contact Info</label>
//         <input 
//           type="text" 
//           value={contactInfo} 
//           placeholder="Enter Contact Info (e.g., email/phone)" 
//           onChange={(e) => setContactInfo(e.target.value)} 
//           required 
//         />
        
//         <label htmlFor="partnershipType">Partnership Type:</label>
//         <select 
//           value={partnershipType} 
//           onChange={(e) => setPartnershipType(e.target.value)} 
//           required
//         >
//           <option value="">Select Type</option>
//           <option value="Lender">Lender</option>
//           <option value="Investor">Investor</option>
//           <option value="Sponsor">Sponsor</option>
//         </select>

//         <label htmlFor="partnerStatus">Status:</label>
//         <select
//           value={partnerStatus}
//           onChange={(e) => setPartnerStatus(e.target.value)}
//           required
//         >
//           <option value="Active">Active</option>
//           <option value="Inactive">Inactive</option>
//         </select>

//         <h3>Total Transactions: {transactionCount}</h3>

//         <select onChange={(e) => handleAddContact(e.target.value)}>
//           <option value="">Select a Contact</option>
//           {availableContacts.map((contact) => (
//             <option key={contact.id} value={contact.id}>{contact.first_name}</option>
//           ))}
//         </select>

//         {selectedContacts.length > 0 && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Contact Name</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedContacts.map((contactId, index) => {
//                 const contact = contacts.find(c => c.id === contactId);
//                 return (
//                   <tr key={contactId}>
//                     <td>{index + 1}</td>
//                     <td>{contact?.first_name}</td>
//                     <td>
//                       <button type="button" onClick={() => handleRemoveContact(contactId)}>✕</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         <select onChange={(e) => handleAddAgreement(e.target.value)}>
//           <option value="">Select an Agreement</option>
//           {availableAgreements.map((agreement) => (
//             <option key={agreement.id} value={agreement.id}>{agreement.title}</option>
//           ))}
//         </select>

//         {selectedAgreements.length > 0 && (
//           <table border="1">
//             <thead>
//               <tr>
//                 <th>Sr No</th>
//                 <th>Agreement Title</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {selectedAgreements.map((agreementId, index) => {
//                 const agreement = agreements.find(a => a.id === agreementId);
//                 return (
//                   <tr key={agreementId}>
//                     <td>{index + 1}</td>
//                     <td>{agreement?.title}</td>
//                     <td>
//                       <button type="button" onClick={() => handleRemoveAgreement(agreementId)}>✕</button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         )}

//         <div className="flex justify-end">
//           <button 
//             type="submit" 
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             {partner ? "Update Partner" : "Add Partner"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddFinancePartner;


import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddFinancePartner = ({ isOpen, toggleSidebar, partner }) => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [partnerName, setPartnerName] = useState("");
  const [partnerDescription, setPartnerDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [partnershipType, setPartnershipType] = useState("");
  const [partnerStatus, setPartnerStatus] = useState("Active");
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [transactionCount, setTransactionCount] = useState(0);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [availableAgreements, setAvailableAgreements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const contactSnapshot = await getDocs(collection(db, "student"));
      const contactsList = contactSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContacts(contactsList);
      setAvailableContacts(contactsList);

      const agreementSnapshot = await getDocs(collection(db, "Agreements"));
      const agreementsList = agreementSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAgreements(agreementsList);
      setAvailableAgreements(agreementsList.filter(agreement => agreement.status === "Active" || !agreement.status));

      if (partner) {
        const transactionSnapshot = await getDocs(collection(db, `FinancePartner/${partner.id}/Transactions`));
        setTransactionCount(transactionSnapshot.docs.length);
      }
    };
    fetchData();
  }, [partner]);

  useEffect(() => {
    if (isOpen) {
      if (partner) {
        // Edit mode: Populate form with partner data
        setPartnerName(partner.name);
        setPartnerDescription(partner.description);
        setContactInfo(partner.contact);
        setPartnershipType(partner.type);
        setPartnerStatus(partner.status || "Active");
        setSelectedContacts(partner.contacts || []);
        setSelectedAgreements(partner.agreements || []);
        setAvailableContacts(contacts.filter(c => !partner.contacts?.includes(c.id)));
        setAvailableAgreements(agreements.filter(a => (a.status === "Active" || !a.status) && !partner.agreements?.includes(a.id)));
      } else {
        // Add mode: Reset form
        resetForm();
      }
    }
  }, [isOpen, partner, contacts, agreements]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const partnerData = {
      name: partnerName,
      description: partnerDescription,
      contact: contactInfo,
      type: partnershipType,
      status: partnerStatus,
      contacts: selectedContacts,
      agreements: selectedAgreements,
      createdAt: serverTimestamp(),
    };

    try {
      if (partner) {
        await updateDoc(doc(db, "FinancePartner", partner.id), partnerData);
        alert("Finance Partner updated successfully!");
      } else {
        await addDoc(collection(db, "FinancePartner"), partnerData);
        alert("Finance Partner added successfully!");
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving finance partner:", error);
      alert("Failed to save finance partner. Please try again.");
    }
  };

  const resetForm = () => {
    setPartnerName("");
    setPartnerDescription("");
    setContactInfo("");
    setPartnershipType("");
    setPartnerStatus("Active");
    setSelectedContacts([]);
    setSelectedAgreements([]);
    setTransactionCount(0);
    setAvailableContacts(contacts);
    setAvailableAgreements(agreements.filter(agreement => agreement.status === "Active" || !agreement.status));
  };

  const handleAddContact = (contactId) => {
    if (contactId && !selectedContacts.includes(contactId)) {
      setSelectedContacts([...selectedContacts, contactId]);
      setAvailableContacts(availableContacts.filter(c => c.id !== contactId));
    }
  };

  const handleRemoveContact = (contactId) => {
    setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    const removedContact = contacts.find(c => c.id === contactId);
    if (removedContact) setAvailableContacts([...availableContacts, removedContact]);
  };

  const handleAddAgreement = (agreementId) => {
    if (agreementId && !selectedAgreements.includes(agreementId)) {
      setSelectedAgreements([...selectedAgreements, agreementId]);
      setAvailableAgreements(availableAgreements.filter(a => a.id !== agreementId));
    }
  };

  const handleRemoveAgreement = (agreementId) => {
    setSelectedAgreements(selectedAgreements.filter(id => id !== agreementId));
    const removedAgreement = agreements.find(a => a.id === agreementId);
    if (removedAgreement && (removedAgreement.status === "Active" || !removedAgreement.status)) {
      setAvailableAgreements([...availableAgreements, removedAgreement]);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-2/5 shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-4 overflow-y-auto`}
    >
      <button 
        type="button" 
        onClick={toggleSidebar} 
        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-200"
      >
        Back
      </button>
      <h1>{partner ? "Edit Finance Partner" : "Add Finance Partner"}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="partnerName">Partner Name:</label>
        <input 
          type="text" 
          value={partnerName} 
          placeholder="Partner Name" 
          onChange={(e) => setPartnerName(e.target.value)} 
          required 
        />
        
        <label htmlFor="partnerDescription">Partner Description</label>
        <input 
          type="text" 
          value={partnerDescription} 
          placeholder="Partner Description" 
          onChange={(e) => setPartnerDescription(e.target.value)} 
          required 
        />
        
        <label htmlFor="contactInfo">Contact Info</label>
        <input 
          type="text" 
          value={contactInfo} 
          placeholder="Enter Contact Info (e.g., email/phone)" 
          onChange={(e) => setContactInfo(e.target.value)} 
          required 
        />
        
        <label htmlFor="partnershipType">Partnership Type:</label>
        <select 
          value={partnershipType} 
          onChange={(e) => setPartnershipType(e.target.value)} 
          required
        >
          <option value="">Select Type</option>
          <option value="Lender">Lender</option>
          <option value="Investor">Investor</option>
          <option value="Sponsor">Sponsor</option>
        </select>

        <label htmlFor="partnerStatus">Status:</label>
        <select
          value={partnerStatus}
          onChange={(e) => setPartnerStatus(e.target.value)}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <h3>Total Transactions: {transactionCount}</h3>

        <select onChange={(e) => handleAddContact(e.target.value)}>
          <option value="">Select a Contact</option>
          {availableContacts.map((contact) => (
            <option key={contact.id} value={contact.id}>{contact.first_name}</option>
          ))}
        </select>

        {selectedContacts.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Contact Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedContacts.map((contactId, index) => {
                const contact = contacts.find(c => c.id === contactId);
                return (
                  <tr key={contactId}>
                    <td>{index + 1}</td>
                    <td>{contact?.first_name}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveContact(contactId)}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <select onChange={(e) => handleAddAgreement(e.target.value)}>
          <option value="">Select an Agreement</option>
          {availableAgreements.map((agreement) => (
            <option key={agreement.id} value={agreement.id}>{agreement.title}</option>
          ))}
        </select>

        {selectedAgreements.length > 0 && (
          <table border="1">
            <thead>
              <tr>
                <th>Sr No</th>
                <th>Agreement Title</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedAgreements.map((agreementId, index) => {
                const agreement = agreements.find(a => a.id === agreementId);
                return (
                  <tr key={agreementId}>
                    <td>{index + 1}</td>
                    <td>{agreement?.title}</td>
                    <td>
                      <button type="button" onClick={() => handleRemoveAgreement(agreementId)}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {partner ? "Update Partner" : "Add Partner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinancePartner;