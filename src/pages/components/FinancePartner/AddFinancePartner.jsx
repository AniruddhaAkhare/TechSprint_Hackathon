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
    setNewScheme({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });
  };

  const handleAddContact = () => {
    if (newContact.name.trim() && newContact.mobile.trim() && newContact.email.trim()) {
      setContactPersons([...contactPersons, { ...newContact }]);
      setNewContact({ name: "", mobile: "", email: "" });
    } else {
      alert("Please fill in all contact person details.");
    }
  };

  const handleAddScheme = () => {
    if (
      newScheme.plan.trim() &&
      newScheme.total_tenure.trim() &&
      newScheme.ratio.trim() &&
      newScheme.subvention_rate.trim() &&
      newScheme.description.trim()
    ) {
      setScheme([...scheme, { ...newScheme }]);
      setNewScheme({ plan: "", total_tenure: "", ratio: "", subvention_rate: "", description: "" });
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
      className={`fixed inset-y-0 right-0 z-50 bg-white w-full shadow-lg transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } p-4 sm:p-6 overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800">
          {partner ? "Edit Finance Partner" : "Add Finance Partner"}
        </h1>
        <button
          onClick={toggleSidebar}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Persons */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Persons</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              value={newContact.name}
              onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Contact Name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              value={newContact.mobile}
              onChange={(e) => setNewContact({ ...newContact, mobile: e.target.value })}
              placeholder="Mobile Number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={newContact.email}
              onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
              placeholder="Email Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddContact}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto"
          >
            Add Contact
          </button>

          {contactPersons.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 sticky top-0">
                  <tr>
                    <th className="p-3 text-sm font-semibold">Sr No</th>
                    <th className="p-3 text-sm font-semibold">Name</th>
                    <th className="p-3 text-sm font-semibold">Mobile</th>
                    <th className="p-3 text-sm font-semibold">Email</th>
                    <th className="p-3 text-sm font-semibold">Action</th>
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
          )}
        </div>

        {/* Scheme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Scheme Details</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={newScheme.plan}
              onChange={(e) => setNewScheme({ ...newScheme, plan: e.target.value })}
              placeholder="Plan"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newScheme.total_tenure}
              onChange={(e) => setNewScheme({ ...newScheme, total_tenure: e.target.value })}
              placeholder="Total Tenure"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newScheme.ratio}
              onChange={(e) => setNewScheme({ ...newScheme, ratio: e.target.value })}
              placeholder="Ratio (Downpayment : Total Tenure)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newScheme.subvention_rate}
              onChange={(e) => setNewScheme({ ...newScheme, subvention_rate: e.target.value })}
              placeholder="Subvention Rate"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={newScheme.description}
              onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
              placeholder="Description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddScheme}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200 w-full sm:w-auto"
          >
            Add Scheme
          </button>

          {scheme.length > 0 && (
            <div className="mt-4 max-h-40 overflow-y-auto border border-gray-300 rounded-md">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-200 text-gray-700 sticky top-0">
                  <tr>
                    <th className="p-3 text-sm font-semibold">Sr No</th>
                    <th className="p-3 text-sm font-semibold">Plan</th>
                    <th className="p-3 text-sm font-semibold">Total Tenure</th>
                    <th className="p-3 text-sm font-semibold">Ratio</th>
                    <th className="p-3 text-sm font-semibold">Subvention Rate</th>
                    <th className="p-3 text-sm font-semibold">Description</th>
                    <th className="p-3 text-sm font-semibold">Action</th>
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
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="Street"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={address.area}
              onChange={(e) => handleAddressChange("area", e.target.value)}
              placeholder="Area"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="City"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={address.state}
              onChange={(e) => handleAddressChange("state", e.target.value)}
              placeholder="State"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={address.country}
              onChange={(e) => handleAddressChange("country", e.target.value)}
              placeholder="Country"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={address.postalCode}
              onChange={(e) => handleAddressChange("postalCode", e.target.value)}
              placeholder="Postal Code"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 w-full sm:w-auto"
          >
            {partner ? "Update Partner" : "Save Partner"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddFinancePartner;