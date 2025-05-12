import { useState, useEffect } from "react";
import { db } from "../../../../../config/firebase.js";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  query,
  orderBy,
  addDoc,
  updateDoc,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useAuth } from "../../../../../context/AuthContext.jsx";
import Modal from "react-modal";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SectionNav from "./SectionNav.jsx";
import CompanyDetails from "./CompanyDetails.jsx";
import JobOpenings from "./JobOpenings.jsx";
import Notes from "./Notes.jsx";
import PointsOfContact from "./PointsOfContact.jsx";
import History from "./History.jsx";
import { Timestamp } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

Modal.setAppElement("#root");

const countryCodes = [
  { code: "+1", label: "USA (+1)" },
  { code: "+1", label: "Canada (+1)" },
  { code: "+7", label: "Russia (+7)" },
  { code: "+91", label: "India (+91)" },
];

const CompanyModal = ({ isOpen, onRequestClose, company, rolePermissions, availableTags = [] }) => {
  const [currentSection, setCurrentSection] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [jobOpenings, setJobOpenings] = useState([]);
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    jobType: "",
    locationType: "",
    city: "",
    location: "",
    experienceMin: "",
    experienceMax: "",
    salary: "",
    currency: "USD",
    duration: "",
    description: "",
    postingDate: "",
    closingDate: "",
    status: "Open",
    skills: [],
    poc: "",
    companyId: company?.id || "",
    companyName: company?.name || "",
  });
//   console.log(company.id)
  const [newPOC, setNewPOC] = useState({ name: "", countryCode: "+91", mobile: "", email: "" });
  const [pointsOfContact, setPointsOfContact] = useState([]);
  const { user } = useAuth();
  const [companyData, setCompanyData] = useState("");

  const canUpdate = rolePermissions?.Companies?.update || false;
  const canDisplay = rolePermissions?.Companies?.display || false;
  const canCreate = rolePermissions?.Companies?.create || false;

  const formatDateSafely = (dateString, formatString) => {
    if (!dateString) return "Not available";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return format(date, formatString);
  };

  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details: { companyId: company?.id || null, ...details },
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid,
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePOCMobile = (mobile) => {
    return /^\d{7,15}$/.test(mobile);
  };

  useEffect(() => {
    if (company) {
      setCompanyData({
        ...company,
        notes: Array.isArray(company.notes) ? company.notes : [],
        tags: Array.isArray(company.tags) ? company.tags : [],
        history: Array.isArray(company.history) ? company.history : [],
        pointsOfContact: Array.isArray(company.pointsOfContact) ? company.pointsOfContact : [],
      });
      setPointsOfContact(Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []);
      setIsEditing(false);
  
      if (!company?.id) {
        setJobOpenings([]);
        return;
      }
  
      const jobQuery = query(
        collection(db, "JobOpenings"),
        where("companyId", "==", company.id)
      );
  
      const unsubscribe = onSnapshot(
        jobQuery,
        (snapshot) => {
          const jobs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            // Ensure dates are properly converted
            postingDate: doc.data().postingDate,
            closingDate: doc.data().closingDate,
          }));
          setJobOpenings(jobs);
        },
        (error) => {
          console.error("Error fetching job openings:", error);
          toast.error(`Failed to fetch job openings: ${error.message}`);
        }
      );
  
      return () => unsubscribe();
    } else {
      setCompanyData({
        name: "",
        domain: "",
        phone: "",
        email: "",
        city: "",
        notes: [],
        tags: [],
        history: [],
        pointsOfContact: [],
      });
      setPointsOfContact([]);
      setJobOpenings([]);
      setIsEditing(true);
    }
  }, [company]);

  const handleAddJobOpening = async () => {
    if (!newJob.title) {
      toast.error("Please fill in all required job opening fields (Title, Job Type, Company).");
      return;
    }
    if (!canUpdate) {
      toast.error("You don't have permission to update companies");
      return;
    }
  
    const closingDateObj = newJob.closingDate ? new Date(newJob.closingDate) : null;
    const postingDateObj = newJob.postingDate ? new Date(newJob.postingDate) : new Date();
    
    if ((closingDateObj && isNaN(closingDateObj.getTime())) || isNaN(postingDateObj.getTime())) {
      toast.error("Invalid date format for posting or closing date");
      return;
    }
  
    const jobData = {
        title: newJob.title,
        companyId: newJob.companyId,
        companyName: newJob.companyName,
        jobType: newJob.jobType,
        department: newJob.department || "",
        experienceMin: newJob.experienceMin ? Number(newJob.experienceMin) : "",
        experienceMax: newJob.experienceMax ? Number(newJob.experienceMax) : "",
        salary: newJob.salary || "",
        currency: newJob.currency || "USD",
        duration: (newJob.jobType === "Internship" || newJob.jobType === "Contract") ? newJob.duration : "",
        locationType: newJob.locationType || "",
        city: newJob.city || "",
        location: newJob.location || "",
        description: newJob.description || "",
        skills: newJob.skills || [],
        poc: newJob.poc && typeof newJob.poc === "object" ? newJob.poc : { name: "", email: "" },
        status: closingDateObj && closingDateObj < new Date() ? "Inactive" : (newJob.status || "Open"),
        postingDate: Timestamp.fromDate(postingDateObj),
        closingDate: closingDateObj ? Timestamp.fromDate(closingDateObj) : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
  
    try {
      const jobRef = await addDoc(collection(db, "JobOpenings"), jobData);
      const historyEntry = {
        action: `Added job opening: "${newJob.title}"`,
        performedBy: user?.displayName || user?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...companyData.history, historyEntry];
      const companyRef = doc(db, "Companies", company.id);
      await updateDoc(companyRef, {
        history: updatedHistory,
        updatedAt: serverTimestamp(),
      });
      setCompanyData((prev) => ({
        ...prev,
        history: updatedHistory,
      }));
      setNewJob({
        title: "",
        department: "",
        jobType: "",
        locationType: "",
        city: "",
        location: "",
        experienceMin: "",
        experienceMax: "",
        salary: "",
        currency: "USD",
        duration: "",
        description: "",
        postingDate: "",
        closingDate: "",
        status: "Open",
        skills: [],
        poc: "",
        companyId: company.id,
        companyName: company.name,
      });
      toast.success("Job opening added successfully!");
    } catch (error) {
      toast.error(`Failed to add job opening: ${error.message}`);
    }
  };

  const handleAddPOC = async () => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update points of contact");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create points of contact");
      return;
    }
    if (
      newPOC.name.trim() &&
      validatePOCMobile(newPOC.mobile) &&
      validateEmail(newPOC.email)
    ) {
      const updatedPOCs = [...pointsOfContact, { ...newPOC }];
      const historyEntry = {
        action: `Added point of contact: "${newPOC.name}"`,
        performedBy: user?.displayName || user?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...companyData.history, historyEntry];
      try {
        const companyRef = doc(db, "Companies", company.id);
        await updateDoc(companyRef, {
          pointsOfContact: updatedPOCs,
          history: updatedHistory,
          updatedAt: new Date().toISOString(),
        });
        setPointsOfContact(updatedPOCs);
        setCompanyData((prev) => ({
          ...prev,
          pointsOfContact: updatedPOCs,
          history: updatedHistory,
        }));
        setNewPOC({ name: "", countryCode: "+91", mobile: "", email: "" });
        logActivity("ADD_POC", { pocName: newPOC.name });
        toast.success("Point of contact added successfully!");
      } catch (error) {
        toast.error(`Failed to add point of contact: ${error.message}`);
      }
    } else {
      toast.error("Please fill in all POC details correctly. Mobile number must be 7-15 digits, and email must be valid.");
    }
  };

  const handleRemovePOC = async (index) => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update points of contact");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create points of contact");
      return;
    }
    const pocName = pointsOfContact[index].name;
    const updatedPOCs = pointsOfContact.filter((_, i) => i !== index);
    const historyEntry = {
      action: `Removed point of contact: "${pocName}"`,
      performedBy: user?.displayName || user?.email || "Unknown User",
      timestamp: new Date().toISOString(),
    };
    const updatedHistory = [...companyData.history, historyEntry];
    try {
      const companyRef = doc(db, "Companies", company.id);
      await updateDoc(companyRef, {
        pointsOfContact: updatedPOCs,
        history: updatedHistory,
        updatedAt: new Date().toISOString(),
      });
      setPointsOfContact(updatedPOCs);
      setCompanyData((prev) => ({
        ...prev,
        pointsOfContact: updatedPOCs,
        history: updatedHistory,
      }));
      logActivity("REMOVE_POC", { pocName });
      toast.success("Point of contact removed successfully!");
    } catch (error) {
      toast.error(`Failed to remove point of contact: ${error.message}`);
    }
  };

  const handlePOCChange = (field, value) => {
    if (!canUpdate && company) {
      toast.error("You don't have permission to update POC details");
      return;
    }
    if (!canCreate && !company) {
      toast.error("You don't have permission to create POC details");
      return;
    }
    if (field === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 15);
    }
    setNewPOC((prev) => {
      const updated = { ...prev, [field]: value };
      logActivity("CHANGE_NEW_POC", { field, value });
      return updated;
    });
  };

  const handleUpdateCompany = async () => {
    if (!companyData.name) {
      toast.error("Company name is required.");
      return;
    }
    if (!canUpdate) {
      toast.error("You don't have permission to update companies");
      return;
    }
    try {
      const companyRef = doc(db, "Companies", company.id);
      const historyEntry = {
        action: `Updated company details`,
        performedBy: user?.displayName || user?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...companyData.history, historyEntry];
      await updateDoc(companyRef, {
        ...companyData,
        history: updatedHistory,
        pointsOfContact: pointsOfContact,
        updatedAt: new Date().toISOString(),
      });
      setCompanyData((prev) => ({
        ...prev,
        history: updatedHistory,
      }));
      setIsEditing(false);
      toast.success("Company updated successfully!");
    } catch (error) {
      toast.error(`Failed to update company: ${error.message}`);
    }
  };

  const handleAddNote = async () => {
      if (!newNote.trim()) {
        toast.error("Please add a note before submitting.");
        return;
      }
  
      if (!canUpdate) {
        toast.error("You don't have permission to update companies");
        return;
      }
  
      const noteObject = {
        content: newNote,
        type: noteType,
        createdAt: new Date().toISOString(),
        addedBy: user?.displayName || user?.email || "Unknown User",
      };
  
      const updatedNotes = [...companyData.notes, noteObject];
      const historyEntry = {
        action: `Added ${formatNoteType(noteType).toLowerCase()}: "${noteObject.content.slice(0, 50)}${noteObject.content.length > 50 ? "..." : ""}"`,
        performedBy: user?.displayName || user?.email || "Unknown User",
        timestamp: new Date().toISOString(),
      };
      const updatedHistory = [...companyData.history, historyEntry];
  
      try {
        const companyRef = doc(db, "Companies", company.id);
        await updateDoc(companyRef, {
          notes: updatedNotes,
          history: updatedHistory,
          updatedAt: new Date().toISOString(),
        });
        setCompanyData((prev) => ({
          ...prev,
          notes: updatedNotes,
          history: updatedHistory,
        }));
        setNewNote("");
        setNoteType("general");
        toast.success("Note added successfully!");
      } catch (error) {
        toast.error(`Failed to add note: ${error.message}`);
      }
    };

  const formatNoteType = (type) => {
    switch (type) {
      case "general":
        return "General Note";
      case "meeting":
        return "Meeting Note";
      case "call":
        return "Call Note";
      default:
        return type;
    }
  };

  const renderField = (value, placeholder = "Not provided") => {
    return value || placeholder;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        className="fixed inset-0 mx-auto my-4 max-w-full sm:max-w-3xl w-[95%] sm:w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 overflow-y-auto max-h-[90vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        style={{
          content: { opacity: isOpen ? 1 : 0, transition: "opacity 0.3s ease-in-out" },
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold">
            {companyData.name || (isEditing ? "Edit Company" : "View Company")}
          </h2>
        </div>
        <SectionNav currentSection={currentSection} setCurrentSection={setCurrentSection} />
        <div className="space-y-4 sm:space-y-6">
          {currentSection === 1 && (
            <CompanyDetails
              companyData={companyData}
              setCompanyData={setCompanyData}
              isEditing={isEditing}
              renderField={renderField}
            />
          )}
          {currentSection === 2 && (
            <JobOpenings
              jobOpenings={jobOpenings}
              newJob={newJob}
              setNewJob={setNewJob}
              isEditing={isEditing}
              handleAddJobOpening={handleAddJobOpening}
              renderField={renderField}
              canUpdate={canUpdate}
              company={company}
            />
          )}
          {currentSection === 3 && (
            <Notes
              companyData={companyData}
              newNote={newNote}
              setNewNote={setNewNote}
              noteType={noteType}
              setNoteType={setNoteType}
              isEditing={isEditing}
              handleAddNote={handleAddNote}
              formatDateSafely={formatDateSafely}
              formatNoteType={formatNoteType}
              canUpdate={canUpdate}
            />
          )}
          {currentSection === 4 && (
            <PointsOfContact
              pointsOfContact={pointsOfContact}
              newPOC={newPOC}
              handlePOCChange={handlePOCChange}
              handleAddPOC={handleAddPOC}
              handleRemovePOC={handleRemovePOC}
              isEditing={isEditing}
              countryCodes={countryCodes}
              canUpdate={canUpdate}
              canCreate={canCreate}
              company={company}
            />
          )}
          {currentSection === 5 && (
            <History
              companyData={companyData}
              formatDateSafely={formatDateSafely}
              canDisplay={canDisplay}
            />
          )}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCompanyData({
                    ...company,
                    notes: Array.isArray(company.notes) ? company.notes : [],
                    tags: Array.isArray(company.tags) ? company.tags : [],
                    history: Array.isArray(company.history) ? company.history : [],
                    pointsOfContact: Array.isArray(company.pointsOfContact)
                      ? company.pointsOfContact
                      : [],
                  });
                  setPointsOfContact(
                    Array.isArray(company.pointsOfContact) ? company.pointsOfContact : []
                  );
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCompany}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Update Company
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRequestClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
              {company && canUpdate && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CompanyModal;