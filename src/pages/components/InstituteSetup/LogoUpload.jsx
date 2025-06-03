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
 <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen">
  <div className="edit-section bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h2 className="text-2xl font-semibold text-gray-900">Logo Upload</h2>
      {canUpdate && (
        <button
          onClick={toggleEditMode}
          className={`px-5 py-2.5 rounded-lg shadow-md font-medium transition duration-200 ${
            editMode
              ? "bg-gray-500 text-white hover:bg-gray-600"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
          }`}
        >
          {editMode ? "Cancel" : "Edit"}
        </button>
      )}
    </div>
  </div>
  <p className="text-sm text-gray-600 mb-6">Upload your institute's logo</p>
  <form onSubmit={(e) => handleSubmit(e, "Branch Setup")} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="logo-upload-section space-y-6">
      <div className="upload-box bg-gray-50 p-6 rounded-lg border border-gray-200">
        {editMode && canUpdate ? (
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="file"
              accept="image/jpeg,image/png,image/svg+xml"
              onChange={handleLogoChange}
              disabled={!editMode}
              className="w-full sm:w-auto px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-200 text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700 file:font-medium file:hover:bg-blue-200"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!editMode}
            >
              Upload Logo
            </button>
          </div>
        ) : null}
        {logoFile && (
          <p className="mt-4 text-sm text-gray-700">Selected file: <span className="font-medium">{logoFile.name}</span></p>
        )}
        {logoError && (
          <p className="mt-4 text-sm text-red-600 font-medium">{logoError}</p>
        )}
        {formData.logoUrl && (
          <div className="logo-preview mt-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Logo:</p>
            <img
              src={formData.logoUrl || "/placeholder.svg"}
              alt="Institute Logo"
              className="max-w-[200px] rounded-md border border-gray-200 shadow-sm"
            />
          </div>
        )}
      </div>
      <p className="text-sm text-gray-600">
        Upload a logo that represents your institute. This will appear in the header of the application.
      </p>
      <div className="logo-requirements">
        <h4 className="text-base font-semibold text-gray-800 mb-3">Logo Requirements:</h4>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>Width: Between 100px and 400px</li>
          <li>Height: Between 50px and 200px</li>
          <li>Maximum file size: 500KB</li>
          <li>Supported formats: JPG, PNG, SVG</li>
          <li>Recommended: Use a transparent background for better integration</li>
        </ul>
      </div>
    </div>
    {editMode && canUpdate && (
      <button
        type="submit"
        className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
      >
        Save and Next →
      </button>
    )}
    {!editMode && (
      <button
        type="button"
        className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition duration-200 font-medium"
        onClick={() => setActiveStep("Branch Setup")}
      >
        Next →
      </button>
    )}
  </form>
</div>
</>
  );
};

export default LogoUpload;