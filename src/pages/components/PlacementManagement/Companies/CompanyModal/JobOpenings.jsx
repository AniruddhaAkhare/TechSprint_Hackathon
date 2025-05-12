import { Timestamp } from "firebase/firestore";

const JobOpenings = ({
    jobOpenings,
    newJob,
    setNewJob,
    isEditing,
    handleAddJobOpening,
    renderField,
    canUpdate,
    company,
}) => {
    const jobTypes = ["Full Time", "Part Time", "Internship", "Contract"];
    const currencies = ["USD", "INR", "EUR", "GBP"];
    const locationTypes = ["Remote", "Hybrid", "On-site"];
    const durations = ["3 Months", "6 Months", "12 Months", "Other"];

    const formatExperience = (job) => {
        if (job.experienceMin && job.experienceMax) {
            return `${job.experienceMin}–${job.experienceMax} Years`;
        }
        if (job.experience) {
            return job.experience; // fallback for existing data
        }
        return "Not provided";
    };


    return (
        <div>
            <h3 className="text-base sm:text-lg font-medium mb-2">Job Openings</h3>
            {isEditing && (
                <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Add New Job Opening</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Title</label>
                            <input
                                type="text"
                                value={newJob.title || ""}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                                placeholder="Enter job title"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Department</label>
                            <input
                                type="text"
                                value={newJob.department || ""}
                                onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                                placeholder="Enter department"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Job Type</label>
                            <select
                                value={newJob.jobType || ""}
                                onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">Select type</option>
                                {jobTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Location Type</label>
                            <select
                                value={newJob.locationType || ""}
                                onChange={(e) => setNewJob({ ...newJob, locationType: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="">Select location type</option>
                                {locationTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {newJob.locationType !== "Remote" && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700">City</label>
                                <input
                                    type="text"
                                    value={newJob.city || ""}
                                    onChange={(e) => setNewJob({ ...newJob, city: e.target.value })}
                                    placeholder="Enter city"
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Location</label>
                            <input
                                type="text"
                                value={newJob.location || ""}
                                onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                                placeholder="Enter location"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Min Experience (Years)</label>
                            <input
                                type="number"
                                min="0"
                                value={newJob.experienceMin || ""}
                                onChange={(e) => setNewJob({ ...newJob, experienceMin: e.target.value })}
                                placeholder="0"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Max Experience (Years)</label>
                            <input
                                type="number"
                                min="0"
                                value={newJob.experienceMax || ""}
                                onChange={(e) => setNewJob({ ...newJob, experienceMax: e.target.value })}
                                placeholder="2"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Salary</label>
                            <input
                                type="text"
                                value={newJob.salary || ""}
                                onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                                placeholder="e.g., 50000-70000"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Currency</label>
                            <select
                                value={newJob.currency || "USD"}
                                onChange={(e) => setNewJob({ ...newJob, currency: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                {currencies.map((curr) => (
                                    <option key={curr} value={curr}>
                                        {curr}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {(newJob.jobType === "Internship" || newJob.jobType === "Contract") && (
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700">Duration</label>
                                <select
                                    value={newJob.duration || ""}
                                    onChange={(e) => setNewJob({ ...newJob, duration: e.target.value })}
                                    className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Select duration</option>
                                    {durations.map((dur) => (
                                        <option key={dur} value={dur}>
                                            {dur}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="sm:col-span-2">
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={newJob.description || ""}
                                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                                placeholder="Enter job description"
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                rows="4"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Posted Date</label>
                            <input
                                type="date"
                                value={newJob.postingDate || ""}
                                onChange={(e) => setNewJob({ ...newJob, postingDate: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Closing Date</label>
                            <input
                                type="date"
                                value={newJob.closingDate || ""}
                                onChange={(e) => setNewJob({ ...newJob, closingDate: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={newJob.status || "Open"}
                                onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                                <option value="Open">Open</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={() =>
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
                                })
                            }
                            className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
                        >
                            Clear
                        </button>
                        <button
                            onClick={handleAddJobOpening}
                            disabled={!canUpdate}
                            className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${!canUpdate ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            Add Job Opening
                        </button>
                    </div>
                </div>
            )}
            <div>
                <h4 className="text-sm font-medium mb-2">Existing Job Openings</h4>
                {jobOpenings.length > 0 ? (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">Title</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Company</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Department</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Job Type</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Location Type</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">City</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Location</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Experience</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[120px]">Salary</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Duration</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Posted</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Closing</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[100px]">Status</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">Skills</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[150px]">POC</th>
                                    <th className="px-3 py-2 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-[200px]">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobOpenings.map((job) => (
                                    <tr key={job.id} className="border-b hover:bg-gray-50">
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.title)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.companyName)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.department)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.jobType)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.locationType)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.city)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.location)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(formatExperience(job))}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
                                            {renderField(job.salary)} {renderField(job.currency)}
                                        </td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.duration)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
                                            {job.postingDate?.toDate?.()?.toLocaleDateString() || "Not provided"}
                                        </td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
                                            {job.closingDate?.toDate?.()?.toLocaleDateString() || "Not provided"}
                                        </td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.status)}</td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
                                            {job.skills?.join(", ") || "Not provided"}
                                        </td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">
                                            {job.poc ? `${job.poc.name} (${job.poc.email})` : "Not provided"}
                                        </td>
                                        <td className="px-3 py-2 text-xs sm:text-sm text-gray-600 truncate">{renderField(job.description)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-xs sm:text-sm text-gray-500">No job openings available.</p>
                )}
            </div>
        </div>
    );
};

export default JobOpenings;