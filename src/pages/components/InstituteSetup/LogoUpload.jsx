import React from "react";

const LogoUpload = ({
  formData,
  setFormData,
  logoFile,
  setLogoFile,
  logoError,
  setLogoError,
  canUpdate,
  editMode,
  toggleEditMode,
  handleSubmit,
  setActiveStep,
}) => {
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/svg+xml"];
      if (!validFormats.includes(file.type)) {
        setLogoError("Invalid file format. Only JPG, PNG, and SVG are supported.");
        return;
      }
      if (file.size > 500 * 1024) {
        setLogoError("File size exceeds 500KB.");
        return;
      }
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        if (width < 100 || width > 400) {
          setLogoError("Width must be between 100px and 400px.");
          return;
        }
        if (height < 50 || height > 200) {
          setLogoError("Height must be between 50px and 200px.");
          return;
        }
        setLogoError("");
        setLogoFile(file);
      };
    }
  };

  return (
    <>
      <div className="edit-section">
        <h2>Logo Upload</h2>
        {canUpdate && (
          <button onClick={toggleEditMode}>
            {editMode ? "Cancel" : "Edit"}
          </button>
        )}
      </div>
      <p>Upload your institute's logo</p>
      <form onSubmit={(e) => handleSubmit(e, "Branch Setup")}>
        <div className="logo-upload-section">
          <div className="upload-box">
            {editMode && canUpdate ? (
              <>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/svg+xml"
                  onChange={handleLogoChange}
                  disabled={!editMode}
                />
                <button type="button" className="upload-btn" disabled={!editMode}>
                  Upload Logo
                </button>
              </>
            ) : null}
            {logoFile && <p>Selected file: {logoFile.name}</p>}
            {logoError && <p className="error">{logoError}</p>}
            {formData.logoUrl && (
              <div className="logo-preview">
                <p>Current Logo:</p>
                <img
                  src={formData.logoUrl || "/placeholder.svg"}
                  alt="Institute Logo"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            )}
          </div>
          <p>
            Upload a logo that represents your institute. This will appear in the header of the application.
          </p>
          <div className="logo-requirements">
            <h4>Logo Requirements:</h4>
            <ul>
              <li>Width: Between 100px and 400px</li>
              <li>Height: Between 50px and 200px</li>
              <li>Maximum file size: 500KB</li>
              <li>Supported formats: JPG, PNG, SVG</li>
              <li>Recommended: Use a transparent background for better integration</li>
            </ul>
          </div>
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
            onClick={() => setActiveStep("Branch Setup")}
          >
            Next →
          </button>
        )}
      </form>
    </>
  );
};

export default LogoUpload;