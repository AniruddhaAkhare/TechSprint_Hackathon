import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { s3Client, debugS3Config } from '../../../../config/aws-config';
import { Upload } from '@aws-sdk/lib-storage';

const AddMaterialModal = ({ isOpen, onClose, curriculumId, sectionId }) => {
  const [view, setView] = useState('typeSelection');
  const [selectedType, setSelectedType] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [materialData, setMaterialData] = useState({
    name: '',
    description: '',
    maxViews: 'Unlimited',
    isPrerequisite: false,
    allowDownload: false,
    accessOn: 'Both',
  });

  const materialTypes = [
    { type: 'Video', icon: '🎥' },
    { type: 'Audio', icon: '🎙️' },
    { type: 'PDF', icon: '📄' },
    { type: 'Youtube', icon: '▶️' },
    { type: 'Image', icon: '🖼️' },
    { type: 'Doc', icon: '📜' },
    { type: 'Sheet', icon: '📊' },
    { type: 'Slide', icon: '📑' },
    { type: 'Text/HTML', icon: '📝' },
    { type: 'Zip', icon: '🗜️' },
    { type: 'Scorm Zip', icon: '📦' },
    { type: 'Link', icon: '🔗' },
    { type: 'Exercise', icon: '🏋️' },
    { type: 'Assignment', icon: '📋' },
    { type: 'Programming Assignment', icon: '💻' },
    { type: 'Form', icon: '📋' },
  ];

  // Check user authentication and role on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = collection(db, "users");
        const userDoc = await addDoc(userDocRef, { uid: user.uid });
        const userData = userDoc.data?.();
        setUserRole(userData?.role || "student");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Log activity to Firestore
  const logActivity = async (action, details) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "activityLogs"), {
        userId: user.uid,
        action,
        details,
        timestamp: serverTimestamp(),
        curriculumId,
        sectionId,
      });
    } catch (error) {
      console.error("Logging error:", error);
    }
  };

  // Permission check function
  const hasPermission = () => {
    return userRole === "admin" || userRole === "instructor";
  };

  const handleTypeSelect = (type) => {
    if (!hasPermission()) {
      setError("You don't have permission to add materials");
      return;
    }
    setSelectedType(type);
    setError(null);
  };

  const handleContinue = () => {
    if (!hasPermission()) {
      setError("You don't have permission to add materials");
      return;
    }
    if (!selectedType) {
      setError('Please select a material type.');
      return;
    }

    if (selectedType === 'PDF') {
      setView('pdfConfig');
    } else if (selectedType === 'Video') {
      setView('videoConfig');
    } else {
      alert(`Proceeding with material type: ${selectedType}`);
      onClose();
    }
  };

  const handleBack = () => {
    if (uploading) return;
    setView('typeSelection');
    setSelectedType(null);
    setFile(null);
    setError(null);
    setUploadProgress(0);
    setMaterialData({
      name: '',
      description: '',
      maxViews: 'Unlimited',
      isPrerequisite: false,
      allowDownload: false,
      accessOn: 'Both',
    });
  };

  const handleFileChange = (e) => {
    if (!hasPermission()) {
      setError("You don't have permission to upload files");
      return;
    }
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (view === 'pdfConfig') {
        if (selectedFile.type !== 'application/pdf') {
          setFile(null);
          setError('Please select a valid PDF file.');
          return;
        }
        const maxSizeInMB = 100;
        if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
          setFile(null);
          setError(`File size exceeds ${maxSizeInMB}MB limit.`);
          return;
        }
      } else if (view === 'videoConfig') {
        const allowedTypes = ['video/mp4', 'video/mpeg', 'video/webm'];
        if (!allowedTypes.includes(selectedFile.type)) {
          setFile(null);
          setError('Please select a valid video file (.mp4, .mpeg, or .webm).');
          return;
        }
        const maxSizeInMB = 100;
        if (selectedFile.size > maxSizeInMB * 1024 * 1024) {
          setFile(null);
          setError(`File size exceeds ${maxSizeInMB}MB limit.`);
          return;
        }
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleMaterialDataChange = (e) => {
    if (!hasPermission()) {
      setError("You don't have permission to modify material data");
      return;
    }
    const { name, value, type, checked } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return null;
    }

    try {
      debugS3Config();
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error("Missing AWS config");
      }

      const fileKey = `materials/${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: bucketName,
          Key: fileKey,
          Body: file,
          ContentType: file.type,
        },
        partSize: 5 * 1024 * 1024,
        queueSize: 4,
      });

      upload.on('httpUploadProgress', (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentage);
      });

      const uploadResult = await upload.done();
      const fileUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      
      await logActivity(
        "file_upload",
        `Uploaded ${selectedType} file: ${file.name} to S3`
      );

      setError(null);
      setUploadProgress(0);
      return fileUrl;
    } catch (error) {
      await logActivity(
        "file_upload_error",
        `Failed to upload ${selectedType} file: ${error.message}`
      );
      setError(`Failed to upload file: ${error.message}`);
      setUploadProgress(0);
      return null;
    }
  };

  const handleAddMaterial = async () => {
    if (!hasPermission()) {
      setError("You don't have permission to add materials");
      return;
    }
    if (!materialData.name) {
      setError('Please enter a material name.');
      return;
    }
    if (!file) {
      setError('Please upload a file.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fileUrl = await handleFileUpload();
      if (!fileUrl) {
        setUploading(false);
        return;
      }

      const materialRef = await addDoc(
        collection(db, `curriculums/${curriculumId}/sections/${sectionId}/materials`),
        {
          type: selectedType,
          name: materialData.name,
          description: materialData.description,
          url: fileUrl,
          maxViews: materialData.maxViews === 'Unlimited' ? null : parseInt(materialData.maxViews, 10),
          isPrerequisite: materialData.isPrerequisite,
          allowDownload: materialData.allowDownload,
          accessOn: materialData.accessOn,
          createdAt: new Date(),
          createdBy: auth.currentUser?.uid,
        }
      );

      await logActivity(
        "add_material",
        `Added ${selectedType} material: ${materialData.name} (ID: ${materialRef.id})`
      );

      setUploading(false);
      onClose();
    } catch (err) {
      await logActivity(
        "add_material_error",
        `Failed to add ${selectedType} material: ${err.message}`
      );
      setError('Failed to save material. Please try again.');
      setUploading(false);
    }
  };

  if (!isOpen || loading) return null;

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3>Add Material</h3>
          <button onClick={onClose} style={styles.closeButton} disabled={uploading}>
            ✕
          </button>
        </div>

        <div style={styles.modalContent}>
          {view === 'typeSelection' && (
            <>
              <p style={styles.subTitle}>Select material type or Clone from existing library</p>
              {hasPermission() ? (
                <div style={styles.materialGrid}>
                  {materialTypes.map((material) => (
                    <div
                      key={material.type}
                      style={{
                        ...styles.materialItem,
                        backgroundColor: selectedType === material.type ? '#e0e7ff' : '#fff',
                      }}
                      onClick={() => handleTypeSelect(material.type)}
                    >
                      <span style={styles.materialIcon}>{material.icon}</span>
                      <span style={styles.materialLabel}>{material.type}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={styles.errorMessage}>You don't have permission to add materials</p>
              )}
              <p style={styles.note}>
                If you don't see your format listed here, please upload it as a zip file.
              </p>
              {error && <div style={styles.errorMessage}>{error}</div>}
            </>
          )}

          {(view === 'pdfConfig' || view === 'videoConfig') && hasPermission() && (
            <>
              <p style={styles.subTitle}>
                Type: {selectedType} <span style={styles.changeLink} onClick={handleBack}>Change</span>
              </p>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Material Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={materialData.name}
                  onChange={handleMaterialDataChange}
                  placeholder="Enter a name for this file"
                  style={styles.input}
                  maxLength={100}
                  disabled={uploading}
                />
                <span style={styles.charCount}>{materialData.name.length} / 100</span>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <span
                    style={styles.addDescription}
                    onClick={() =>
                      setMaterialData((prev) => ({
                        ...prev,
                        description: prev.description ? '' : ' ',
                      }))
                    }
                  >
                    + Add Description (Optional)
                  </span>
                </label>
                {materialData.description !== '' && (
                  <textarea
                    name="description"
                    value={materialData.description}
                    onChange={handleMaterialDataChange}
                    placeholder="Enter a description"
                    style={styles.textarea}
                    disabled={uploading}
                  />
                )}
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Upload file <span style={styles.required}>*</span>
                </label>
                <div style={styles.uploadBox}>
                  {file ? (
                    <p style={styles.fileName}>Selected file: {file.name}</p>
                  ) : (
                    <>
                      <span style={styles.uploadIcon}>☁️</span>
                      <p>Upload file {view === 'pdfConfig' ? '(.pdf)' : '(.mp4, .mpeg or .webm)'}</p>
                      <p style={styles.uploadNote}>Max file size supported is 100MB</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept={view === 'pdfConfig' ? 'application/pdf' : 'video/mp4,video/mpeg,video/webm'}
                    onChange={handleFileChange}
                    style={styles.fileInputOverlay}
                    disabled={uploading}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Maximum views <span style={styles.required}>*</span>
                </label>
                <select
                  name="maxViews"
                  value={materialData.maxViews}
                  onChange={handleMaterialDataChange}
                  style={styles.select}
                  disabled={uploading}
                >
                  <option value="Unlimited">Unlimited</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>More Options</label>
                <div style={styles.checkboxGroup}>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="isPrerequisite"
                      checked={materialData.isPrerequisite}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Make this a prerequisite
                  </label>
                  <label style={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      name="allowDownload"
                      checked={materialData.allowDownload}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Enable download
                  </label>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Allow access on</label>
                <div style={styles.radioGroup}>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="accessOn"
                      value="Both"
                      checked={materialData.accessOn === 'Both'}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    Both
                  </label>
                  <label style={styles.radioLabel}>
                    <input
                      type="radio"
                      name="accessOn"
                      value="App"
                      checked={materialData.accessOn === 'App'}
                      onChange={handleMaterialDataChange}
                      disabled={uploading}
                    />
                    App
                  </label>
                </div>
              </div>
              {error && <div style={styles.errorMessage}>{error}</div>}
              {uploading && (
                <div style={styles.progressBar}>
                  <div style={{ ...styles.progressFill, width: `${uploadProgress}%` }} />
                  <span style={styles.progressText}>{Math.round(uploadProgress)}%</span>
                </div>
              )}
            </>
          )}
        </div>

        <div style={styles.formActions}>
          {view === 'typeSelection' ? (
            <>
              <button onClick={onClose} style={styles.cancelButton} disabled={uploading}>
                Cancel
              </button>
              <button onClick={handleContinue} style={styles.continueButton} disabled={uploading}>
                Continue
              </button>
            </>
          ) : (
            <>
              <button onClick={handleBack} style={styles.backButton} disabled={uploading}>
                Back
              </button>
              {hasPermission() && (
                <button onClick={handleAddMaterial} style={styles.addButton} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Add Material'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline styles remain unchanged
const styles = {
  // ... (keeping all the existing styles)
};

// Animation stylesheet remains unchanged
const styleSheet = document.createElement('style');
styleSheet.innerHTML = `
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(styleSheet);

export default AddMaterialModal;