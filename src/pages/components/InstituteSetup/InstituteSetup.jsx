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
        //console.error();
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
      // //console.error("S3 Upload Error:", error);
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
      } else if (canUpdate) {
        await updateDoc(docRef, updatedFormData);
      }

      alert("Data saved successfully!");
      setEditModes((prev) => ({ ...prev, [activeStep]: false }));

      if (nextStep) setActiveStep(nextStep);
      else navigate("/dashboard");
    } catch (error) {
      // //console.error("Error saving data:", error);
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
   <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100 min-h-screen fixed inset-0 left-[300px] overflow-y-auto">
  <div className="header flex items-center gap-3 mb-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <FaBook className="text-blue-600 text-2xl" />
    <h1 className="text-2xl font-bold text-[#333333] font-sans">Institute Setup</h1>
  </div>

  <div className="content grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div className="steps bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Onboarding Steps</h2>
      <p className="text-sm text-gray-600 mb-4">Complete these steps to set up your institute</p>
      <ul className="space-y-2">
        <li
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition duration-200 ${
            activeStep === "Basic Information"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveStep("Basic Information")}
        >
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
            1
          </span>
          Basic Information
        </li>
        <li
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition duration-200 ${
            activeStep === "Logo Upload"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveStep("Logo Upload")}
        >
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
            2
          </span>
          Logo Upload
        </li>
        <li
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition duration-200 ${
            activeStep === "Branch Setup"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveStep("Branch Setup")}
        >
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
            3
          </span>
          Center Setup
        </li>
        <li
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition duration-200 ${
            activeStep === "Contact Information"
              ? "bg-blue-100 text-blue-800 font-medium"
              : "text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setActiveStep("Contact Information")}
        >
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white text-sm">
            4
          </span>
          Contact Information
        </li>
      </ul>
    </div>

    <div className="form-section lg:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
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
