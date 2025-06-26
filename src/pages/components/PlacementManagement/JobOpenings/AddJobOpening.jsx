import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { runTransaction } from "firebase/firestore";

const jobTypes = ["Full Time", "Part Time", "Internship", "Contract"];
const currencies = ["USD", "INR", "EUR", "GBP"];
const locationTypes = ["Remote", "Hybrid", "On-site"];
const durations = ["3 Months", "6 Months", "12 Months", "Other"];

const AddJobOpening = ({ isOpen, toggleSidebar, job }) => {
  const { user, rolePermissions } = useAuth();
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobType, setJobType] = useState("");
  const [department, setDepartment] = useState("");
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [duration, setDuration] = useState("");
  const [locationType, setLocationType] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [poc, setPoc] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [postingDate, setPostingDate] = useState(new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Open");
  const [companies, setCompanies] = useState([]);
  const [pocs, setPocs] = useState([]);
  const [userDisplayName, setUserDisplayName] = useState(""); // New state for displayName

  const canDisplay = rolePermissions.JobOpenings?.display || false;
  const canCreate = rolePermissions.JobOpenings?.create || false;
  const canUpdate = rolePermissions.JobOpenings?.update || false;
  const canDelete = rolePermissions.JobOpenings?.delete || false;
  // Fetch user displayName from Users collection
  useEffect(() => {
    if (!user?.uid) return;

    const fetchUserDisplayName = async () => {
      try {
        const userDocRef = doc(db, "Users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDisplayName(userData.displayName || user.email || "Unknown User");
        } else {
          console.warn("User document not found in Users collection");
          setUserDisplayName(user.email || "Unknown User");
        }
      } catch (error) {
        //console.error("Error fetching user displayName:", error);
        toast.error(`Failed to fetch user data: ${error.message}`);
        setUserDisplayName(user.email || "Unknown User");
      }
    };

    fetchUserDisplayName();
  }, [user?.uid, user?.email]);

  const logActivity = async (action, details) => {
    if (!user?.email) return;
  
    const activityLogRef = doc(db, "activityLogs", "logDocument");
  
    const logEntry = {
      action,
      details,
      timestamp: new Date().toISOString(),
      userEmail: user.email,
      userId: user.uid,
      section: "Job Opening",
      // adminId: adminId || "N/A",
    };
  
    try {
      await runTransaction(db, async (transaction) => {
        const logDoc = await transaction.get(activityLogRef);
        let logs = logDoc.exists() ? logDoc.data().logs || [] : [];
  
        // Ensure logs is an array and contains only valid data
        if (!Array.isArray(logs)) {
          logs = [];
        }
  
        // Append the new log entry
        logs.push(logEntry);
  
        // Trim to the last 1000 entries if necessary
        if (logs.length > 1000) {
          logs = logs.slice(-1000);
        }
  
        // Update the document with the new logs array
        transaction.set(activityLogRef, { logs }, { merge: true });
      });
      console.log("Activity logged successfully");
    } catch (error) {
      console.error("Error logging activity:", error);
      // toast.error("Failed to log activity");
    }
  };
    
    // const fetchLogs = useCallback(() => {
    //   if (!isAdmin) return;
    //   const q = query(LogsCollectionRef, orderBy("timestamp", "desc"));
    //   const unsubscribe = onSnapshot(
    //     q,
    //     (snapshot) => {
    //       const allLogs = [];
    //       snapshot.docs.forEach((doc) => {
    //         const data = doc.data();
    //         (data.logs || []).forEach((log) => {
    //           allLogs.push({ id: doc.id, ...log });
    //         });
    //       });
    //       allLogs.sort(
    //         (a, b) =>
    //           (b.timestamp?.toDate() || new Date(0)) - (a.timestamp?.toDate() || new Date(0))
    //       );
    //       setLogs(allLogs);
    //     },
    //   );
    //   return unsubscribe;
    // }, [isAdmin]);

  const timestampToDateString = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      const date = timestamp.toDate();
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
    return "";
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Companies"));
        const companyData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCompanies(companyData);
      } catch (err) {
        //console.error("Error fetching companies:", err);
      }
    };
    if (canDisplay) fetchCompanies();
  }, [canDisplay]);

  useEffect(() => {
    if (isOpen && job) {
      setTitle(job.title || "");
      setCompanyId(job.companyId || "");
      setCompanyName(job.companyName || "");
      setJobType(job.jobType || "");
      setDepartment(job.department || "");
      setExperienceMin(job.experience?.split("–")[0] || "");
      setExperienceMax(job.experience?.split("–")[1]?.replace(" Years", "") || "");
      setSalary(job.salary || "");
      setCurrency(job.currency || "USD");
      setDuration(job.duration || "");
      setLocationType(job.locationType || "");
      setCity(job.city || "");
      setLocation(job.location || "");
      setDescription(job.description || "");
      setSkills(job.skills || []);
      setPoc(job.poc || "");
      setStatus(job.status || "Open");
      setClosingDate(timestampToDateString(job.closingDate));
      setPostingDate(timestampToDateString(job.postingDate) || new Date().toISOString().split("T")[0]);
      setPocs(companies.find((c) => c.id === job.companyId)?.pointsOfContact || []);
    } else if (isOpen) {
      resetForm();
    }
  }, [isOpen, job, companies]);

  useEffect(() => {
    if (companyId) {
      const selectedCompany = companies.find((c) => c.id === companyId);
      setPocs(selectedCompany?.pointsOfContact || []);
      setCompanyName(selectedCompany?.name || "");
      setPoc("");
    } else {
      setPocs([]);
      setCompanyName("");
      setPoc("");
    }
  }, [companyId, companies]);

  const resetForm = () => {
    setTitle("");
    setCompanyId("");
    setCompanyName("");
    setJobType("");
    setDepartment("");
    setExperienceMin("");
    setExperienceMax("");
    setSalary("");
    setCurrency("USD");
    setDuration("");
    setLocationType("");
    setCity("");
    setLocation("");
    setDescription("");
    setSkills([]);
    setNewSkill("");
    setPoc("");
    setStatus("Open");
    setClosingDate("");
    setPostingDate(new Date().toISOString().split("T")[0]);
    setPocs([]);
    // logActivity("RESET_FORM", {});
  };

  const handleAddSkill = () => {
    if (!canUpdate && job) {
      toast.error("You don't have permission to update skills");
      return;
    }
    if (!canCreate && !job) {
      toast.error("You don't have permission to create skills");
      return;
    }
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      logActivity("skills added", { skill: newSkill });
    }
  };

  const handleRemoveSkill = (skill) => {
    if (!canUpdate && job) {
      toast.error("You don't have permission to update skills");
      return;
    }
    if (!canCreate && !job) {
      toast.error("You don't have permission to create skills");
      return;
    }
    setSkills(skills.filter((s) => s !== skill));
    logActivity("Skill removed", { skill });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredPermission = job ? canUpdate : canCreate;
    const actionType = job ? "update" : "create";
    if (!requiredPermission) {
      toast.error(`You don't have permission to ${actionType} a job opening`);
      return;
    }

    if (!title.trim() || !companyId || !jobType) {
      toast.error("Please fill in all required fields (Title, Company, Job Type)");
      return;
    }

    const closingDateObj = closingDate ? new Date(closingDate) : null;
    const postingDateObj = postingDate ? new Date(postingDate) : new Date();
    if ((closingDateObj && isNaN(closingDateObj.getTime())) || isNaN(postingDateObj.getTime())) {
      toast.error("Invalid date format for posting or closing date");
      return;
    }

    const jobHistoryEntry = {
      action: job ? "Updated" : "Created",
      performedBy: userDisplayName,
      timestamp: new Date().toISOString(),
      details: job ? `Updated job "${title}"` : `Created job "${title}"`,
    };

    const jobData = {
      title,
      companyId,
      companyName,
      jobType,
      department: department || "",
      experience: experienceMin && experienceMax ? `${experienceMin}–${experienceMax} Years` : "",
      salary: salary || "",
      currency: currency || "USD",
      duration: (jobType === "Internship" || jobType === "Contract") ? duration : "",
      locationType: locationType || "",
      city: city || "",
      location: location || "",
      description: description || "",
      skills: skills || [],
      poc: poc || "",
      status: closingDateObj && closingDateObj < new Date() ? "Inactive" : (status || "Open"),
      postingDate: Timestamp.fromDate(postingDateObj),
      closingDate: closingDateObj ? Timestamp.fromDate(closingDateObj) : null,
      updatedAt: serverTimestamp(),
      history: job ? arrayUnion(jobHistoryEntry) : [jobHistoryEntry], // Append or initialize history
    };

    if (!job) {
      jobData.createdAt = serverTimestamp();
    }

    try {
      let jobId;
      if (job) {
        const jobRef = doc(db, "JobOpenings", job.id);
        await updateDoc(jobRef, jobData);
        jobId = job.id;
        toast.success("Job opening updated successfully!");
        logActivity("Job Updated", { title, jobId, closingDate, postingDate });
      } else {
        const docRef = await addDoc(collection(db, "JobOpenings"), jobData);
        jobId = docRef.id;
        toast.success("Job opening added successfully!");
        logActivity("Job Created", { title, jobId, closingDate, postingDate });
      }

      // Update company history
      const companyHistoryEntry = {
        action: job ? `Updated job opening: "${title}"` : `Added job opening: "${title}"`,
        performedBy: userDisplayName,
        timestamp: new Date().toISOString(),
      };
      const companyRef = doc(db, "Companies", companyId);
      const companyDoc = await getDoc(companyRef);
      const currentCompanyHistory = companyDoc.exists() && Array.isArray(companyDoc.data().history) ? companyDoc.data().history : [];
      await updateDoc(companyRef, {
        history: [...currentCompanyHistory, companyHistoryEntry],
        updatedAt: serverTimestamp(),
      });

      resetForm();
      toggleSidebar();
    } catch (error) {
      //console.error("Error saving job opening:", error);
      toast.error("Failed to save job opening. Please try again.");
    }
  };

  const handleClose = () => {
    toggleSidebar();
    // logActivity("CLOSE_SIDEBAR", {});
  };

  if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div
        className={`fixed inset-y-0 right-0 z-50 bg-white w-full sm:w-3/4 md:w-2/5 shadow-lg transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } p-4 sm:p-6 overflow-y-auto`}
      >
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {job ? "Edit Job Opening" : "Add Job Opening"}
          </h1>
          <button
            onClick={handleClose}
            className="bg-indigo-600 text-white px-2 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2"
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
      
  <div className="space-y-8">
    {/* Job Title */}
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
        Job Title <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter job title"
        required
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    {/* Company */}
    <div>
      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
        Company <span className="text-red-500">*</span>
      </label>
      <select
        id="company"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        required
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>

    {/* Job Type */}
    <div>
      <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
        Job Type <span className="text-red-500">*</span>
      </label>
      <select
        id="jobType"
        value={jobType}
        onChange={(e) => setJobType(e.target.value)}
        required
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select Job Type</option>
        {jobTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* Department */}
    <div>
      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
        Department
      </label>
      <input
        type="text"
        id="department"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        placeholder="Enter department"
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    {/* Experience Range */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="experienceMin" className="block text-sm font-medium text-gray-700 mb-2">
          Min Experience (Years)
        </label>
        <input
          type="number"
          id="experienceMin"
          value={experienceMin}
          onChange={(e) => setExperienceMin(e.target.value)}
          placeholder="0"
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="experienceMax" className="block text-sm font-medium text-gray-700 mb-2">
          Max Experience (Years)
        </label>
        <input
          type="number"
          id="experienceMax"
          value={experienceMax}
          onChange={(e) => setExperienceMax(e.target.value)}
          placeholder="2"
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>

    {/* Salary and Currency */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-2">
          Salary/Stipend
        </label>
        <input
          type="text"
          id="salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="e.g., 50000-70000"
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          {currencies.map((curr) => (
            <option key={curr} value={curr}>
              {curr}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Duration (Conditional) */}
    {(jobType === "Internship" || jobType === "Contract") && (
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Duration
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="">Select Duration</option>
          {durations.map((dur) => (
            <option key={dur} value={dur}>
              {dur}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Posting and Closing Dates */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label htmlFor="postingDate" className="block text-sm font-medium text-gray-700 mb-2">
          Posting Date
        </label>
        <input
          type="date"
          id="postingDate"
          value={postingDate}
          onChange={(e) => setPostingDate(e.target.value)}
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
      <div>
        <label htmlFor="closingDate" className="block text-sm font-medium text-gray-700 mb-2">
          Closing Date
        </label>
        <input
          type="date"
          id="closingDate"
          value={closingDate}
          onChange={(e) => setClosingDate(e.target.value)}
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    </div>

    {/* Status */}
    <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="Open">Open</option>
        <option value="Inactive">Inactive</option>
        <option value="Closed">Closed</option>
      </select>
    </div>

    {/* Location Type */}
    <div>
      <label htmlFor="locationType" className="block text-sm font-medium text-gray-700 mb-2">
        Location Type
      </label>
      <select
        id="locationType"
        value={locationType}
        onChange={(e) => setLocationType(e.target.value)}
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select Location Type</option>
        {locationTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>

    {/* City (Conditional) */}
    {locationType !== "Remote" && (
      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
          City
        </label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>
    )}

    {/* Location */}
    <div>
      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
        Location
      </label>
      <input
        type="text"
        id="location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>

    {/* Job Description */}
    <div>
      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
        Job Description
      </label>
      <ReactQuill
        id="description"
        value={description}
        onChange={setDescription}
        className="mt-1 bg-gray-50 rounded-lg"
        readOnly={(!canUpdate && job) || (!canCreate && !job)}
        modules={{
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
            ["clean"],
          ],
        }}
      />
    </div>

    {/* Skills Required */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Enter skill"
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleAddSkill}
          disabled={(!canUpdate && job) || (!canCreate && !job)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full flex items-center text-sm"
          >
            {skill}
            <button
              type="button"
              onClick={() => handleRemoveSkill(skill)}
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="ml-2 text-red-600 hover:text-red-800 transition duration-200"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>

    {/* Point of Contact */}
    <div>
      <label htmlFor="poc" className="block text-sm font-medium text-gray-700 mb-2">
        Point of Contact
      </label>
      <select
        id="poc"
        value={poc ? JSON.stringify(poc) : ""}
        onChange={(e) => setPoc(e.target.value ? JSON.parse(e.target.value) : "")}
        disabled={(!canUpdate && job) || (!canCreate && !job) || !companyId}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
      >
        <option value="">Select POC</option>
        {pocs.map((contact, index) => (
          <option key={index} value={JSON.stringify(contact)}>
            {contact.name} ({contact.email})
          </option>
        ))}
      </select>
    </div>

    {/* Form Actions */}
    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleSubmit}
        disabled={(!canUpdate && job) || (!canCreate && !job)}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {job ? "Update Job" : "Save Job"}
      </button>
    </div>
  </div>
        </form>
      </div>
    </>
  );
};

export default AddJobOpening;