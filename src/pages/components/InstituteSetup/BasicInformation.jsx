import React from "react";

const BasicInformation = ({ formData, setFormData, canUpdate, editMode, toggleEditMode, handleSubmit }) => {
  const handleChange = (e) => {
    if (!canUpdate) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="edit-section">
        <h2>Basic Information</h2>
        {canUpdate && (
          <button onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <p>Enter your institute's basic details</p>
      <form onSubmit={(e) => handleSubmit(e, "Logo Upload")}>
        <div className="form-row">
          <div className="form-group">
            <label>Institute Name <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                placeholder="Enter institute name"
                required
              />
            ) : (
              <div className="read-only">{formData.instituteName || "Not set"}</div>
            )}
          </div>
          <div className="form-group">
            <label>Institute Type <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="instituteType"
                value={formData.instituteType}
                onChange={handleChange}
                placeholder="School, College, University, etc."
                required
              />
            ) : (
              <div className="read-only">{formData.instituteType || "Not set"}</div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Address <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
              />
            ) : (
              <div className="read-only">{formData.address || "Not set"}</div>
            )}
          </div>
          <div className="form-group">
            <label>City <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            ) : (
              <div className="read-only">{formData.city || "Not set"}</div>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>State <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                required
              />
            ) : (
              <div className="read-only">{formData.state || "Not set"}</div>
            )}
          </div>
          <div className="form-group">
            <label>Pincode <span className="form-group-required">*</span></label>
            {editMode && canUpdate ? (
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter pincode"
                required
              />
            ) : (
              <div className="read-only">{formData.pincode || "Not set"}</div>
            )}
          </div>
        </div>
        {editMode && canUpdate && (
          <button type="submit" className="next-btn">
            Save and Next →
          </button>
        )}
      </form>
    </>
  );
};

export default BasicInformation;