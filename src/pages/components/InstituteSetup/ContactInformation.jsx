import React, { useState } from "react";

const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  // { code: "+1", label: "Canada (+1)" },
  { code: "+7", label: "Russia (+7)" },
  { code: "+20", label: "Egypt (+20)" },
  { code: "+27", label: "South Africa (+27)" },
  { code: "+30", label: "Greece (+30)" },
 
];

const ContactInformation = ({
  formData,
  setFormData,
  canUpdate,
  editMode,
  toggleEditMode,
  handleSubmit,
  setActiveStep,
}) => {
  const [countryCode, setCountryCode] = useState(
    formData.phoneNumber?.match(/^\+(\d+)/)?.[0] || "+91"
  );

  const handleChange = (e) => {
    if (!canUpdate) return;
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: `${countryCode}${numericValue}`,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <>
      <div className="edit-section">
        <h2>Contact Information</h2>
        {canUpdate && (
          <button onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <p>Add contact details for your institute</p>
      <form onSubmit={(e) => handleSubmit(e, "System Configuration")}>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
              />
            ) : (
              <div className="read-only">{formData.email || "Not set"}</div>
            )}
          </div>
          <div className="form-group">
            <label>Phone Number <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <div className="phone-input-wrapper flex">
                <select
                  value={countryCode}
                  onChange={(e) => {
                    const newCountryCode = e.target.value;
                    setCountryCode(newCountryCode);
                    setFormData((prev) => ({
                      ...prev,
                      phoneNumber: prev.phoneNumber
                        ? newCountryCode + prev.phoneNumber.replace(countryCode, "")
                        : newCountryCode,
                    }));
                  }}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.label}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber.replace(countryCode, "")}
                  onChange={handleChange}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                  required
                  className="flex-1 px-3 py-2 border border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div className="read-only">{formData.phoneNumber || "Not set"}</div>
            )}
          </div>
        </div>
        <div className="form-group">
          <label>Website</label>
          {editMode && canUpdate ? (
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="Enter website URL"
            />
          ) : (
            <div className="read-only">{formData.website || "Not set"}</div>
          )}
        </div>
        {editMode && canUpdate && (
          <button type="submit" className="next-btn">
            Save and Next →
          </button>
        )}
        {!editMode && (
          <button
            type="button"
            className="next-btn"
            onClick={() => setActiveStep("System Configuration")}
          >
            Next →
          </button>
        )}
      </form>
    </>
  );
};

export default ContactInformation;