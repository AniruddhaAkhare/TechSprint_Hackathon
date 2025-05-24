import React, { useState } from "react";
import { db } from "../../../config/firebase";
import { collection, addDoc, updateDoc, doc, getDocs } from "firebase/firestore";

const countryCodes = [
  // { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+7", label: "Russia (+7)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+30", label: "Greece (+30)" },
  
];

const BranchFormModal = ({
  instituteId,
  currentBranch,
  setShowModal,
  setBranches,
  canCreate,
  canUpdate,
}) => {
  // Initialize contact number and country code
  const extractPhoneDetails = (contactNumber) => {
    if (!contactNumber) {
      return { countryCode: "+91", number: "" };
    }
    const match = contactNumber.match(/^\+(\d+)/);
    const countryCode = match ? `+${match[1]}` : "+91";
    const number = match ? contactNumber.replace(/^\+\d+/, "") : contactNumber;
    return { countryCode, number };
  };

  const { countryCode: initialCountryCode, number: initialNumber } = extractPhoneDetails(
    currentBranch?.contactNumber
  );

  // Debug to confirm initial values
  console.log("currentBranch.contactNumber:", currentBranch?.contactNumber);
  console.log("initialCountryCode:", initialCountryCode);
  console.log("initialNumber:", initialNumber);

  const [branchForm, setBranchForm] = useState({
    name: currentBranch?.name || "",
    addressLine1: currentBranch?.addressLine1 || "",
    addressLine2: currentBranch?.addressLine2 || "",
    city: currentBranch?.city || "",
    state: currentBranch?.state || "",
    postalCode: currentBranch?.postalCode || "",
    country: currentBranch?.country || "India",
    isActive: currentBranch?.isActive !== undefined ? currentBranch.isActive : true,
    contactNumber: currentBranch?.contactNumber || "",
    email: currentBranch?.email || "",
    latitude: currentBranch?.latitude?.toString() || "",
    longitude: currentBranch?.longitude?.toString() || "",
  });
  const [branchCountryCode, setBranchCountryCode] = useState(initialCountryCode);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [useManualEntry, setUseManualEntry] = useState(false);

  const handleBranchChange = (e) => {
    if (!canUpdate && currentBranch) return;
    if (!canCreate && !currentBranch) return;
    const { name, value, type, checked } = e.target;
    if (name === "contactNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setBranchForm((prev) => ({
        ...prev,
        contactNumber: numericValue,
      }));
    } else if (name === "latitude" || name === "longitude") {
      const numericValue = value.replace(/[^0-9.-]/g, "");
      setBranchForm((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setBranchForm((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setUseManualEntry(true);
      return;
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setLocationError("Geolocation requires a secure context (HTTPS). Please access this page over HTTPS.");
      setUseManualEntry(true);
      return;
    }

    setIsFetchingLocation(true);
    setLocationError("");
    setUseManualEntry(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
          setLocationError("Invalid coordinates received.");
          setIsFetchingLocation(false);
          setUseManualEntry(true);
          return;
        }
        const formattedLatitude = latitude.toFixed(6);
        const formattedLongitude = longitude.toFixed(6);
        setBranchForm((prev) => ({
          ...prev,
          latitude: formattedLatitude,
          longitude: formattedLongitude,
        }));
        setIsFetchingLocation(false);
        setLocationError("");
      },
      (error) => {
        setIsFetchingLocation(false);
        let errorMessage = "Unable to fetch current location: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Location access was denied. Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable. Try moving to an area with better GPS or network coverage.";
            break;
          case error.TIMEOUT:
            errorMessage += "The request to get location timed out. Please try again or enter coordinates manually.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
            break;
        }
        setLocationError(errorMessage);
        setUseManualEntry(true);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      }
    );
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!instituteId) {
      alert("Please save the institute details first.");
      return;
    }
    if (!canCreate && !currentBranch) return;
    if (!canUpdate && currentBranch) return;

    const latitude = parseFloat(branchForm.latitude);
    const longitude = parseFloat(branchForm.longitude);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      alert("Please enter a valid latitude between -90 and 90.");
      return;
    }
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      alert("Please enter a valid longitude between -180 and 180.");
      return;
    }

    try {
      const fullContactNumber = branchForm.contactNumber ? `${branchForm.contactNumber}` : "";
      const updatedBranchForm = {
        ...branchForm,
        contactNumber: fullContactNumber,
        latitude: latitude,
        longitude: longitude,
      };

      if (currentBranch && canUpdate) {
        const branchRef = doc(db, "instituteSetup", instituteId, "Center", currentBranch.id);
        await updateDoc(branchRef, updatedBranchForm);
        setBranches((prev) =>
          prev.map((branch) =>
            branch.id === currentBranch.id ? { id: currentBranch.id, ...updatedBranchForm } : branch
          )
        );
        alert("Branch updated successfully!");
      } else if (canCreate) {
        const newBranch = await addDoc(collection(db, "instituteSetup", instituteId, "Center"), updatedBranchForm);
        setBranches((prev) => [
          ...prev,
          { id: newBranch.id, ...updatedBranchForm },
        ].sort((a, b) => a.name.localeCompare(b.name)));
        alert("Branch added successfully!");
      }
      setShowModal(false);
      setBranchForm({
        name: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isActive: true,
        contactNumber: "",
        email: "",
        latitude: "",
        longitude: "",
      });
      setBranchCountryCode("+91");
    } catch (error) {
      console.error("Error saving branch: ", error);
      alert("Error saving branch");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>{currentBranch ? "Edit Center" : "Add Center"}</h2>
        <form onSubmit={handleBranchSubmit}>
          <div className="form-group">
            <label>Center Name <span className="form-group-required">*</span></label>
            <input
              type="text"
              name="name"
              value={branchForm.name}
              onChange={handleBranchChange}
              placeholder="Enter Center name"
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 1 <span className="form-group-required">*</span></label>
            <input
              type="text"
              name="addressLine1"
              value={branchForm.addressLine1}
              onChange={handleBranchChange}
              placeholder="Enter address line 1"
              required
            />
          </div>
          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={branchForm.addressLine2}
              onChange={handleBranchChange}
              placeholder="Enter address line 2"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="city"
                value={branchForm.city}
                onChange={handleBranchChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="form-group">
              <label>State <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="state"
                value={branchForm.state}
                onChange={handleBranchChange}
                placeholder="Enter state"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Postal Code <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="postalCode"
                value={branchForm.postalCode}
                onChange={handleBranchChange}
                placeholder="Enter postal code"
                required
              />
            </div>
            <div className="form-group">
              <label>Country <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="country"
                value={branchForm.country}
                onChange={handleBranchChange}
                placeholder="Enter country"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Contact Number <span className="form-group-required">*</span></label>
              <div className="flex items-center space-x-2">
                <select
                  value={branchCountryCode}
                  onChange={(e) => setBranchCountryCode(e.target.value)}
                  className="w-1/4 px-2 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="contactNumber"
                  value={branchForm.contactNumber}
                  onChange={handleBranchChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10" 
                  minLength="10"
                  required
                  className="w-3/4 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email <span className="form-group-required">*</span></label>
              <input
                type="email"
                name="email"
                value={branchForm.email}
                onChange={handleBranchChange}
                placeholder="Enter email"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Latitude <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="latitude"
                value={branchForm.latitude}
                onChange={handleBranchChange}
                placeholder="Enter latitude"
                required
                disabled={isFetchingLocation}
              />
            </div>
            <div className="form-group">
              <label>Longitude <span className="form-group-required">*</span></label>
              <input
                type="text"
                name="longitude"
                value={branchForm.longitude}
                onChange={handleBranchChange}
                placeholder="Enter longitude"
                required
                disabled={isFetchingLocation}
              />
            </div>
          </div>
          <div className="form-group">
            <button
              type="button"
              onClick={getCurrentLocation}
              disabled={isFetchingLocation}
              className={`mb-2 px-4 py-2 rounded ${isFetchingLocation ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {isFetchingLocation ? "Fetching Location..." : "Use Current Location"}
            </button>
            {useManualEntry && (
              <p className="text-sm text-gray-600 mb-2">
                Unable to fetch location automatically. Please enter coordinates manually or try again.
              </p>
            )}
            {locationError && <p className="text-red-500 text-sm mb-2">{locationError}</p>}
            {useManualEntry && (
              <button
                type="button"
                onClick={() => {
                  setUseManualEntry(false);
                  setLocationError("");
                  getCurrentLocation();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Retry Location
              </button>
            )}
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isActive"
                checked={branchForm.isActive}
                onChange={handleBranchChange}
              />
              Center is active
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save Center
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchFormModal;