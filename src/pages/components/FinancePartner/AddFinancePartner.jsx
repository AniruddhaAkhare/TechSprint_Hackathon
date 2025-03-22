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
  const [partnerName, setPartnerName] = useState("");
  const [contactPersons, setContactPersons] = useState([]);
  const [scheme, setScheme] = useState([]);
  const [address, setAddress] = useState({
    street: "",
    area: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [status, setStatus] = useState("Active");
  const [transactionCount, setTransactionCount] = useState(0);

  const [newContact, setNewContact] = useState({ name: "", mobile: "", email: "" });
  const [newScheme, setNewScheme] = useState({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });

  useEffect(() => {
    const fetchData = async () => {
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
        setPartnerName(partner.name || "");
        setContactPersons(partner.contactPersons || []);
        setScheme(partner.scheme || []);
        setAddress({
          street: partner.address?.street || "",
          area: partner.address?.area || "",
          city: partner.address?.city || "",
          state: partner.address?.state || "",
          country: partner.address?.country || "",
          postalCode: partner.address?.postalCode || "",
        });
        setStatus(partner.status || "Active");
      } else {
        // Add mode: Reset form
        resetForm();
      }
    }
  }, [isOpen, partner]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const partnerData = {
      name: partnerName,
      contactPersons,
      address,
      status,
      createdAt: serverTimestamp(),
      scheme,
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
    setContactPersons([]);
    setScheme([]);
    setAddress({ street: "", area: "", city: "", state: "", country: "", postalCode: "" });
    setStatus("Active");
    setTransactionCount(0);
    setNewContact({ name: "", mobile: "", email: "" });
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.mobile.trim() && newContact.email.trim()) {
      setContactPersons([...contactPersons, { ...newContact }]);
      setNewContact({ name: "", mobile: "", email: "" }); // Clear inputs after adding
    } else {
      alert("Please fill in all contact person details.");
    }
  };
  const handleAddScheme = () => {
    if (newScheme.plan.trim() && newScheme.total_tenure.trim() && newScheme.ratio.trim() && newScheme.subvention_rate.trim() && newScheme.description.trim()) {
      setScheme([...scheme, { ...newScheme }]);
      setNewScheme({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" }); // Clear inputs after adding
    } else {
      alert("Please fill in all scheme details.");
    }
  };

  const handleRemoveContact = (index) => {
    setContactPersons(contactPersons.filter((_, i) => i !== index));
  };
  const handleRemoveScheme = (index) => {
    setScheme(scheme.filter((_, i) => i !== index));
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-full sm:w-2/5 shadow-lg transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
        } p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {partner ? "Edit Finance Partner" : "Add Finance Partner"}
        </h1>
        <button
          type="button"
          onClick={toggleSidebar}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
        >
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Partner Name */}
        <div>
          <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
            Partner Name
          </label>
          <input
            type="text"
            id="partnerName"
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
            placeholder="Enter partner name"
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Persons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="col">
              <label className="text-xs mb-0">Name</label><br />
              <input

                type="text"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Contact Name"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
            <div className="col">
              <label className="text-xs mb-0">Mobile Number</label><br />
              <input
                type="tel"
                label="Phone"
                value={newContact.mobile}
                onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
                placeholder="Mobile Number"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
            <div className="col">
              <label className="text-xs mb-0">Email</label><br />
              <input
                type="email"
                value={newContact.email}
                onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                placeholder="Email Address"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddContact}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Contact
          </button>

          {contactPersons.length > 0 ? (
            <div className="mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-700">Sr No</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Name</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Mobile</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Email</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contactPersons.map((contact, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{index + 1}</td>
                      <td className="p-3 text-gray-600">{contact.name}</td>
                      <td className="p-3 text-gray-600">{contact.mobile}</td>
                      <td className="p-3 text-gray-600">{contact.email}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveContact(index)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No contact persons added yet.</p>
          )}
        </div>

        {/* Scheme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Details</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs mb-0">Plan</label>
              <input
                type="text"
                value={newScheme.plan}
                onChange={(e) => setNewScheme({ ...newScheme, plan: e.target.value })}
                placeholder="Plan"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
              />
            </div>
            <div>
              <label className="text-xs mb-0">Total Tenure</label>
              <input
                type="text"
                value={newScheme.total_tenure}
                onChange={(e) => setNewScheme({ ...newScheme, total_tenure: e.target.value })}
                placeholder="Total Tenure"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            <div>
              <label className="text-xs mb-0">Ratio (Downpayment : Total tenure)</label>
              <input
                type="text"
                value={newScheme.ratio}
                onChange={(e) => setNewScheme({ ...newScheme, ratio: e.target.value })}
                placeholder="Ratio (Downpayment : Total Tenure)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-0">Subvention Rate</label>
              <input
                type="text"
                value={newScheme.subvention_rate}
                onChange={(e) => setNewScheme({ ...newScheme, subvention_rate: e.target.value })}
                placeholder="Subvention rate"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-0">Description</label>
              <input
                type="text"
                value={newScheme.description}
                onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                placeholder="Description"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>



          </div>
          <button
            type="button"
            onClick={handleAddScheme}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Scheme
          </button>

          {scheme.length > 0 ? (
            <div className="mt-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-sm font-medium text-gray-700">Sr No</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Plan</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Total tenure</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Ratio (Downpayment : Total Tenure)</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Subvention Rate</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Description</th>
                    <th className="p-3 text-sm font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {scheme.map((s, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-gray-600">{index + 1}</td>
                      <td className="p-3 text-gray-600">{s.plan}</td>
                      <td className="p-3 text-gray-600">{s.total_tenure}</td>
                      <td className="p-3 text-gray-600">{s.ratio}</td>
                      <td className="p-3 text-gray-600">{s.subvention_rate}</td>
                      <td className="p-3 text-gray-600">{s.description}</td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => handleRemoveScheme(index)}
                          className="text-red-500 hover:text-red-700 font-bold"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-2 text-sm text-gray-500">No scheme added yet.</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs mb-0">Street</label>
              <input
                type="text"
                value={address.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                placeholder="Street"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs mb-0">Area</label>
              <input
                type="text"
                value={address.area}
                onChange={(e) => handleAddressChange("area", e.target.value)}
                placeholder="Area"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs mb-0">City</label>
              <input
                type="text"
                value={address.city}
                onChange={(e) => handleAddressChange("city", e.target.value)}
                placeholder="City"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-0">State</label>
              <input
                type="text"
                value={address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                placeholder="State"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-0">Country</label>
              <input
                type="text"
                value={address.country}
                onChange={(e) => handleAddressChange("country", e.target.value)}
                placeholder="Country"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs mb-0">Postal Code</label>
              <input
                type="text"
                value={address.postalCode}
                onChange={(e) => handleAddressChange("postalCode", e.target.value)}
                placeholder="Postal Code"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>




          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Transaction Count */}
        {partner && (
          <div>
            <h3 className="text-sm font-medium text-gray-700">Total Transactions: {transactionCount}</h3>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            {partner ? "Update Partner" : "Add Partner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinancePartner;