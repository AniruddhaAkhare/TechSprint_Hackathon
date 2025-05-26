import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../../config/firebase";
import { collection, addDoc, getDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import "./InstituteSetup.css";
import { FaBook } from "react-icons/fa";
import { s3Client } from "../../../config/aws-config";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { debugS3Config } from "../../../config/aws-config";
import { useAuth } from "../../../context/AuthContext";
import BasicInformation from "./BasicInformation";
import LogoUpload from "./LogoUpload";
import BranchSetup from "./BranchSetup";
import ContactInformation from "./ContactInformation";

const InstituteSetup = () => {
  const navigate = useNavigate();
  const { rolePermissions } = useAuth();
  const [activeStep, setActiveStep] = useState("Basic Information");
  const [formData, setFormData] = useState({
    instituteName: "",
    instituteType: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    contactNumber: "",
    website: "",
    academicYearStart: "",
    academicYearEnd: "",
    timezone: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [instituteId, setInstituteId] = useState("RDJ9wMXGrIUk221MzDxP"); 
  const [editModes, setEditModes] = useState({
    "Basic Information": false,
    "Logo Upload": false,
    "Branch Setup": false,
    "Contact Information": false,
    "System Configuration": false,
  });

  const canCreate = rolePermissions?.instituteSetup?.create || false;
  const canUpdate = rolePermissions?.instituteSetup?.update || false;
  const canDisplay = rolePermissions?.instituteSetup?.display || false;
  const canDelete = rolePermissions?.instituteSetup?.delete || false;

  useEffect(() => {
    if (!canDisplay) {
      navigate("/unauthorized");
      return;
    }

    const fetchInstituteData = async () => {
      try {
        const docRef = doc(db, "instituteSetup", instituteId);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setFormData({
            ...formData,
            ...data,
            contactNumber: data.contactNumber || "",
            email: data.email || "",
            website: data.website || "",
            academicYearStart: data.academicYearStart || "",
            academicYearEnd: data.academicYearEnd || "",
            timezone: data.timezone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching institute data:", error);
      }
    };

    fetchInstituteData();
  }, [canDisplay, navigate]);

  const handleLogoUpload = async () => {
    if (!logoFile) {
      setLogoError("Please select a logo to upload");
      return null;
    }
    try {
      debugS3Config();
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error("Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION");
      }
      const fileKey = `logos/${Date.now()}_${logoFile.name.replace(/\s+/g, "_")}`;
      const fileBuffer = await logoFile.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: logoFile.type,
      };
      await s3Client.send(new PutObjectCommand(params));
      const logoUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      setFormData((prev) => ({ ...prev, logoUrl }));
      setLogoError("");
      return logoUrl;
    } catch (error) {
      console.error("S3 Upload Error:", error);
      setLogoError("Failed to upload logo: " + error.message);
      return null;
    }
  };

  const handleSubmit = async (e, nextStep) => {
    e.preventDefault();
    if (!canCreate && !instituteId) {
      alert("You don't have permission to create an institute.");
      return;
    }
    if (!canUpdate && instituteId) {
      alert("You don't have permission to update this institute.");
      return;
    }

    if (!formData.instituteName || !formData.instituteType) {
      alert("Please fill in required fields (Institute Name and Type).");
      return;
    }

    try {
      let updatedFormData = { ...formData };

      if (activeStep === "Logo Upload" && logoFile) {
        const logoUrl = await handleLogoUpload();
        if (!logoUrl) return;
        updatedFormData.logoUrl = logoUrl;
      }

      const docRef = doc(db, "instituteSetup", instituteId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() && canCreate) {
        await setDoc(docRef, updatedFormData);
        console.log("Created new institute with ID:", instituteId);
      } else if (canUpdate) {
        await updateDoc(docRef, updatedFormData);
        console.log("Updated institute with ID:", instituteId);
      }

      alert("Data saved successfully!");
      setEditModes((prev) => ({ ...prev, [activeStep]: false }));

      if (nextStep) setActiveStep(nextStep);
      else navigate("/dashboard");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const toggleEditMode = (section) => {
    if (!canUpdate) {
      alert("You don't have permission to edit this section.");
      return;
    }
    setEditModes((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!canDisplay) return null;

  return (
    <div className="institute-setup p-4 fixed inset-0 left-[300px] overflow-auto">
      <div className="header">
        <FaBook className="header-icon" />
        <h1>Institute Setup</h1>
      </div>

      <div className="content">
        <div className="steps">
          <h2>Onboarding Steps</h2>
          <p>Complete these steps to set up your institute</p>
          <ul>
            <li className={activeStep === "Basic Information" ? "active" : ""} onClick={() => setActiveStep("Basic Information")}>
              1 Basic Information
            </li>
            <li className={activeStep === "Logo Upload" ? "active" : ""} onClick={() => setActiveStep("Logo Upload")}>
              2 Logo Upload
            </li>
            <li className={activeStep === "Branch Setup" ? "active" : ""} onClick={() => setActiveStep("Branch Setup")}>
              3 Center Setup
            </li>
            <li className={activeStep === "Contact Information" ? "active" : ""} onClick={() => setActiveStep("Contact Information")}>
              4 Contact Information
            </li>
          </ul>
        </div>

        <div className="form-section">
          {activeStep === "Basic Information" && (
            <BasicInformation
              formData={formData}
              setFormData={setFormData}
              canUpdate={canUpdate}
              editMode={editModes["Basic Information"]}
              toggleEditMode={() => toggleEditMode("Basic Information")}
              handleSubmit={handleSubmit}
            />
          )}
          {activeStep === "Logo Upload" && (
            <LogoUpload
              formData={formData}
              setFormData={setFormData}
              logoFile={logoFile}
              setLogoFile={setLogoFile}
              logoError={logoError}
              setLogoError={setLogoError}
              canUpdate={canUpdate}
              editMode={editModes["Logo Upload"]}
              toggleEditMode={() => toggleEditMode("Logo Upload")}
              handleSubmit={handleSubmit}
              setActiveStep={setActiveStep}
            />
          )}
          {activeStep === "Branch Setup" && (
            <BranchSetup
              instituteId={instituteId}
              canCreate={canCreate}
              canUpdate={canUpdate}
              canDelete={canDelete}
              setActiveStep={setActiveStep}
            />
          )}
          {activeStep === "Contact Information" && (
            <ContactInformation
              formData={formData}
              setFormData={setFormData}
              canUpdate={canUpdate}
              editMode={editModes["Contact Information"]}
              toggleEditMode={() => toggleEditMode("Contact Information")}
              handleSubmit={handleSubmit}
              setActiveStep={setActiveStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default InstituteSetup;
