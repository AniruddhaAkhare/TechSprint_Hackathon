import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const statuses = ["Pending", "Applied", "Rejected", "Shortlisted", "Interviewed"];
const courses = ["B.Tech", "MBA", "M.Tech", "BBA", "Other"];
const ratings = [1, 2, 3, 4, 5];

const ApplicationManagement = ({ jobId, jobSkills }) => {
  const { user, rolePermissions } = useAuth();
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [students, setStudents] = useState([]);
  const [newApplication, setNewApplication] = useState({
    studentId: "",
    studentName: "",
    studentEmail: "",
    course: "",
    skills: [],
    status: "Pending",
    rating: "",
    remarks: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [shareableLink, setShareableLink] = useState("");

//   const canCreate = rolePermissions?.Applications?.create || false;
//   const canUpdate = rolePermissions?.Applications?.update || false;
//   const canDisplay = rolePermissions?.Applications?.display || false;

  const logActivity = async (action, details) => {
    try {
      const activityLog = {
        action,
        details: { jobId, ...details },
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
    const fetchApplications = async () => {
      try {
        const snapshot = await getDocs(collection(db, `JobOpenings/${jobId}/Applications`));
        const appData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(appData);
        setFilteredApplications(appData);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "student"));
        const studentData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStudents(studentData);
      } catch (err) {
        console.error("Error fetching students:", err);
      }
    };

    // if (canDisplay) {
    //   fetchApplications();
    //   fetchStudents();
    // }
    fetchApplications();
    fetchStudents();
//   }, [canDisplay, jobId]);
}, [jobId]);


  useEffect(() => {
    let filtered = applications;
    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }
    if (courseFilter) {
      filtered = filtered.filter((app) => app.course === courseFilter);
    }
    if (ratingFilter) {
      filtered = filtered.filter((app) => app.rating === parseInt(ratingFilter));
    }
    if (skillFilter) {
      filtered = filtered.filter((app) => app.skills.includes(skillFilter));
    }
    setFilteredApplications(filtered);
  }, [statusFilter, courseFilter, ratingFilter, skillFilter, applications]);

  const handleStudentSelect = (studentId) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      setNewApplication({
        ...newApplication,
        studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        studentEmail: student.email || "",
        course: student.course || "",
        skills: student.skills || [],
      });
    } else {
      setNewApplication({
        ...newApplication,
        studentId: "",
        studentName: "",
        studentEmail: "",
        course: "",
        skills: [],
      });
    }
  };

  const handleAddApplication = async () => {
    // if (!canCreate) {
    //   toast.error("You don't have permission to create applications");
    //   return;
    // }
    if (!newApplication.studentId || !newApplication.course || newApplication.skills.length === 0) {
      toast.error("Please select a student and ensure all required fields are filled");
      return;
    }
    try {
      const appData = {
        ...newApplication,
        createdAt: serverTimestamp(),
      };
      const docRef = await addDoc(collection(db, `JobOpenings/${jobId}/Applications`), appData);
      setApplications([...applications, { id: docRef.id, ...appData }]);
      setNewApplication({
        studentId: "",
        studentName: "",
        studentEmail: "",
        course: "",
        skills: [],
        status: "Pending",
        rating: "",
        remarks: "",
      });
      setNewSkill("");
      toast.success("Application added successfully!");
      logActivity("CREATE_APPLICATION", { studentId: newApplication.studentId, studentName: newApplication.studentName });
    } catch (err) {
      console.error("Error adding application:", err);
      toast.error("Failed to add application.");
    }
  };

  const handleUpdateApplication = async (id, updates) => {
    // if (!canUpdate) {
    //   toast.error("You don't have permission to update applications");
    //   return;
    // }
    try {
      await updateDoc(doc(db, `JobOpenings/${jobId}/Applications`, id), updates);
      setApplications(applications.map((app) => (app.id === id ? { ...app, ...updates } : app)));
      toast.success("Application updated successfully!");
      logActivity("UPDATE_APPLICATION", { applicationId: id, updates });
    } catch (err) {
      console.error("Error updating application:", err);
      toast.error("Failed to update application.");
    }
  };

  const handleAddSkill = () => {
    // if (!canCreate && !newApplication.id) {
    //   toast.error("You don't have permission to add skills");
    //   return;
    // }
    if (!newApplication.id) {
        toast.error("You don't have permission to add skills");
        return;
      }
    if (newSkill.trim() && !newApplication.skills.includes(newSkill.trim())) {
      setNewApplication({ ...newApplication, skills: [...newApplication.skills, newSkill.trim()] });
      setNewSkill("");
      logActivity("ADD_APPLICATION_SKILL", { skill: newSkill });
    }
  };

  const handleRemoveSkill = (skill) => {
    // if (!canCreate && !newApplication.id) {
    //   toast.error("You don't have permission to remove skills");
    //   return;
    // }
    if (!newApplication.id) {
        toast.error("You don't have permission to remove skills");
        return;
      }
    setNewApplication({ ...newApplication, skills: newApplication.skills.filter((s) => s !== skill) });
    logActivity("REMOVE_APPLICATION_SKILL", { skill });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleBulkEmail = () => {
    // if (!canUpdate) {
    //   toast.error("You don't have permission to send emails");
    //   return;
    // }
    if (selectedApplications.length === 0) {
      toast.error("Please select at least one application");
      return;
    }
    // Pseudo-code: Implement email service
    // selectedApplications.forEach((appId) => {
    //   const app = applications.find((a) => a.id === appId);
    //   sendEmail(app.studentEmail, "Shortlisted for Interview", `You have been shortlisted for ${job.title}`);
    // });
    toast.success("Emails sent to selected candidates!");
    logActivity("SEND_BULK_EMAIL", { applicationIds: selectedApplications });
  };

  const generateShareableLink = () => {
    const link = `${window.location.origin}/recruiter-view/${jobId}`;
    setShareableLink(link);
    navigator.clipboard.writeText(link);
    toast.success("Shareable link copied to clipboard!");
    logActivity("GENERATE_SHAREABLE_LINK", { jobId, link });
  };

  const onDragEnd = (result) => {
    // if (!canUpdate) {
    //   toast.error("You don't have permission to update application status");
    //   return;
    // }
    if (!result.destination) return;
    const updatedApplications = [...filteredApplications];
    const [reorderedItem] = updatedApplications.splice(result.source.index, 1);
    updatedApplications.splice(result.destination.index, 0, reorderedItem);
    setFilteredApplications(updatedApplications);
    handleUpdateApplication(reorderedItem.id, { status: reorderedItem.status });
  };

//   if (!canDisplay) return null;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="space-y-6">
        {/* Add Application */}
        {
        // canCreate && 
        (
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Application</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <select
                value={newApplication.studentId}
                onChange={(e) => handleStudentSelect(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.firstName} {student.lastName} ({student.email})
                  </option>
                ))}
              </select>
              <select
                value={newApplication.course}
                onChange={(e) => setNewApplication({ ...newApplication, course: e.target.value })}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              >
                <option value="">{newApplication.course || "Select Course"}</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add Skill"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newApplication.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handleAddApplication}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Application
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Courses</option>
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Ratings</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
          <select
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Skills</option>
            {jobSkills.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Shareable Link */}
        {
        // canUpdate && 
        (
          <div>
            <button
              onClick={generateShareableLink}
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              Generate Shareable Link
            </button>
            {shareableLink && <p className="mt-2 text-gray-600">{shareableLink}</p>}
          </div>
        )}

        {/* Applications Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                  />
                </th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Student Name</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Course</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Rating</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Skills</th>
                <th className="px-4 py-3 text-left text-base font-semibold text-gray-700">Remarks</th>
              </tr>
            </thead>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="applications">
                {(provided) => (
                  <tbody {...provided.droppableProps} ref={provided.innerRef}>
                    {filteredApplications.map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="px-4 py-3">
                              <input
                                type="checkbox"
                                checked={selectedApplications.includes(app.id)}
                                onChange={() => {
                                  setSelectedApplications(
                                    selectedApplications.includes(app.id)
                                      ? selectedApplications.filter((id) => id !== app.id)
                                      : [...selectedApplications, app.id]
                                  );
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-gray-800">{app.studentName}</td>
                            <td className="px-4 py-3 text-gray-800">{app.course}</td>
                            <td className="px-4 py-3 text-gray-800">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateApplication(app.id, { status: e.target.value })}
                                // disabled={!canUpdate}
                                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                {statuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-800">
                              <select
                                value={app.rating || ""}
                                onChange={(e) => handleUpdateApplication(app.id, { rating: parseInt(e.target.value) })}
                                // disabled={!canUpdate}
                                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="">No Rating</option>
                                {ratings.map((rating) => (
                                  <option key={rating} value={rating}>
                                    {rating} Stars
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-4 py-3 text-gray-800">{app.skills.join(", ")}</td>
                            <td className="px-4 py-3 text-gray-800">
                              <input
                                type="text"
                                value={app.remarks || ""}
                                onChange={(e) => handleUpdateApplication(app.id, { remarks: e.target.value })}
                                // disabled={!canUpdate}
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                )}
              </Droppable>
            </DragDropContext>
          </table>
          {filteredApplications.length === 0 && (
            <p className="text-gray-500 text-center mt-4">No applications found</p>
          )}
        </div>

        {/* Bulk Actions */}
        {
        // canUpdate && 
        selectedApplications.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleBulkEmail}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Send Email to Selected
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ApplicationManagement;