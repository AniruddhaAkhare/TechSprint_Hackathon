import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [experienceMin, setExperienceMin] = useState("");
  const [experienceMax, setExperienceMax] = useState("");
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [duration, setDuration] = useState("");
  const [locationType, setLocationType] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [poc, setPoc] = useState("");
  const [deadline, setDeadline] = useState(""); // New deadline field
  const [companies, setCompanies] = useState([]);
  const [pocs, setPocs] = useState([]);

  const canCreate = rolePermissions?.JobOpenings?.create || false;
  const canUpdate = rolePermissions?.JobOpenings?.update || false;
  const canDisplay = rolePermissions?.JobOpenings?.display || false;

  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details: { jobId: job?.id || null, ...details },
        timestamp: new Date().toISOString(),
        userEmail: user?.email || "anonymous",
        userId: user.uid,
      };
      await addDoc(collection(db, "activityLogs"), activityLog);
    } catch (error) {
      console.error("Error logging activity:", error);
    }
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
        console.error("Error fetching companies:", err);
      }
    };
    if (canDisplay) fetchCompanies();
  }, [canDisplay]);

  useEffect(() => {
    if (isOpen) {
      if (job) {
        setTitle(job.title || "");
        setCompanyId(job.companyId || "");
        setCompanyName(job.companyName || "");
        setJobType(job.jobType || "");
        setExperienceMin(job.experience.split("–")[0] || "");
        setExperienceMax(job.experience.split("–")[1]?.replace(" Years", "") || "");
        setSalary(job.salary || "");
        setCurrency(job.currency || "USD");
        setDuration(job.duration || "");
        setLocationType(job.locationType || "");
        setCity(job.city || "");
        setDescription(job.description || "");
        setSkills(job.skills || []);
        setPoc(job.poc || "");
        setDeadline(job.deadline ? job.deadline.toDate().toISOString().split("T")[0] : "");
        setPocs(companies.find((c) => c.id === job.companyId)?.pointsOfContact || []);
      } else {
        resetForm();
      }
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
    setExperienceMin("");
    setExperienceMax("");
    setSalary("");
    setCurrency("USD");
    setDuration("");
    setLocationType("");
    setCity("");
    setDescription("");
    setSkills([]);
    setNewSkill("");
    setPoc("");
    setDeadline(""); // Reset deadline
    setPocs([]);
    logActivity("RESET_FORM", {});
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
      logActivity("ADD_SKILL", { skill: newSkill });
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
    logActivity("REMOVE_SKILL", { skill });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredPermission = job ? canUpdate : canCreate;
    const actionType = job ? "update" : "create";
    if (!requiredPermission) {
      toast.error(`You don't have permission to ${actionType} a job opening`);
      return;
    }

    if (!title.trim() || !companyId || !jobType || !experienceMin || !experienceMax || !salary || !locationType || !poc || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const jobStatus = deadlineDate < currentDate ? "Inactive" : "Open";

    const jobData = {
      title,
      companyId,
      companyName,
      jobType,
      experience: `${experienceMin}–${experienceMax} Years`,
      salary,
      currency,
      duration: jobType === "Internship" || jobType === "Contract" ? duration : "",
      locationType,
      city,
      description,
      skills,
      poc,
      status: jobStatus,
      deadline: Timestamp.fromDate(deadlineDate),
      createdAt: serverTimestamp(),
    };

    try {
      if (job) {
        await updateDoc(doc(db, "JobOpenings", job.id), jobData);
        toast.success("Job opening updated successfully!");
        logActivity("UPDATE_JOB", { title, deadline });
      } else {
        const docRef = await addDoc(collection(db, "JobOpenings"), jobData);
        toast.success("Job opening added successfully!");
        logActivity("CREATE_JOB", { title, jobId: docRef.id, deadline });
        // Auto-email to POC (pseudo-code, implement with your email service)
        // sendEmail(poc.email, `New Job Opening: ${title}`, `A new job opening has been published: ${title}`);
      }
      resetForm();
      toggleSidebar();
    } catch (error) {
      console.error("Error saving job opening:", error);
      toast.error("Failed to save job opening. Please try again.");
    }
  };

  const handleClose = () => {
    toggleSidebar();
    logActivity("CLOSE_SIDEBAR", {});
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
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-red-600 transition duration-200"
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
          {/* Job Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter job title"
              required
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company
            </label>
            <select
              id="company"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700">
              Job Type
            </label>
            <select
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              required
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Job Type</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="flex gap-4">
            <div>
              <label htmlFor="experienceMin" className="block text-sm font-medium text-gray-700">
                Min Experience (Years)
              </label>
              <input
                type="number"
                id="experienceMin"
                value={experienceMin}
                onChange={(e) => setExperienceMin(e.target.value)}
                placeholder="0"
                required
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="experienceMax" className="block text-sm font-medium text-gray-700">
                Max Experience (Years)
              </label>
              <input
                type="number"
                id="experienceMax"
                value={experienceMax}
                onChange={(e) => setExperienceMax(e.target.value)}
                placeholder="2"
                required
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Salary/Stipend */}
          <div className="flex gap-4">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary/Stipend
              </label>
              <input
                type="text"
                id="salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g., 50000-70000"
                required
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                Currency
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                required
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration (for Internship/Contract) */}
          {(jobType === "Internship" || jobType === "Contract") && (
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

          {/* Deadline */}
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="locationType" className="block text-sm font-medium text-gray-700">
              Location Type
            </label>
            <select
              id="locationType"
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              required
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select Location Type</option>
              {locationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {locationType !== "Remote" && (
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city"
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          )}

          {/* Job Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Job Description
            </label>
            <ReactQuill
              id="description"
              value={description}
              onChange={setDescription}
              className="mt-1"
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

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skills Required</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Enter skill"
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                disabled={(!canUpdate && job) || (!canCreate && !job)}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    disabled={(!canUpdate && job) || (!canCreate && !job)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Point of Contact */}
          <div>
            <label htmlFor="poc" className="block text-sm font-medium text-gray-700">
              Point of Contact
            </label>
            <select
              id="poc"
              value={JSON.stringify(poc)}
              onChange={(e) => setPoc(JSON.parse(e.target.value))}
              required
              disabled={(!canUpdate && job) || (!canCreate && !job) || !companyId}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Select POC</option>
              {pocs.map((contact, index) => (
                <option key={index} value={JSON.stringify(contact)}>
                  {contact.name} ({contact.email})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={(!canUpdate && job) || (!canCreate && !job)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {job ? "Update Job" : "Save Job"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddJobOpening;