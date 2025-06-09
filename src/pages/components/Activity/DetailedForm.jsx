import React, { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { format } from "date-fns";

const DetailedForm = ({
  newTodo,
  setNewTodo,
  onSubmit,
  onClose,
  setIsDetailedForm,
  formatDateSafely,
  isDatePickerOpen,
  setIsDatePickerOpen,
  predefinedDates,
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  daysInMonth,
  firstDayOfMonth,
  days,
  emptyDays,
  handleDateSelect,
  handlePredefinedDateSelect,
  handleMonthChange,
  error,
}) => {
  const [users, setUsers] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [isEditMode, setIsEditMode] = useState(!newTodo.id);
  const [history, setHistory] = useState([]);
  const [comment, setComment] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState([]);
  const [showMentions, setShowMentions] = useState(false);
  const currentUser = auth.currentUser || { displayName: "Unknown User", email: "unknown@example.com" };

  // Fetch dropdown data from Firestore
  const fetchDropdownData = async () => {
    try {
      const usersQuery = query(collection(db, "Users"));
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const enquiriesQuery = query(collection(db, "enquiries"));
      const enquiriesSnapshot = await getDocs(enquiriesQuery);
      setEnquiries(enquiriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const companiesQuery = query(collection(db, "Companies"));
      const companiesSnapshot = await getDocs(companiesQuery);
      setCompanies(companiesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      const studentsQuery = query(collection(db, "student"));
      const studentsSnapshot = await getDocs(studentsQuery);
      setStudents(studentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

      if (newTodo.id) {
        const historyQuery = query(collection(db, `activities/${newTodo.id}/history`));
        const historySnapshot = await getDocs(historyQuery);
        setHistory(historySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      }
    } catch (err) {
      console.error(`Failed to fetch dropdown data: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, [newTodo.id]);

  const handleTodoChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTodo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => option.value);
    setNewTodo((prev) => ({
      ...prev,
      assignees: selectedOptions,
    }));
  };

  const handleAddAnother = async (e) => {
    e.preventDefault();
    await onSubmit(e);
    setNewTodo({
      name: "",
      description: "",
      module: "general",
      assignees: [currentUser.displayName || currentUser.email],
      dueDate: "",
      highPriority: false,
      createdBy: currentUser.displayName || currentUser.email,
      status: "pending",
      enquiry: "",
      company: "",
      student: "",
      history: [],
      comments: [],
    });
    setIsEditMode(true);
  };

  const handleStatusChange = async (status) => {
    try {
      const activityRef = doc(db, "activities", newTodo.id);
      await updateDoc(activityRef, { status });
      setNewTodo((prev) => ({ ...prev, status }));
      await addDoc(collection(db, `activities/${newTodo.id}/history`), {
        action: `Status changed to ${status}`,
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      });
      fetchDropdownData();
    } catch (err) {
      console.error(`Failed to update status: ${err.message}`);
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setComment(value);
    if (value.includes("@")) {
      const query = value.split("@").pop().toLowerCase();
      setMentionSuggestions(
        users.filter((user) => user.displayName.toLowerCase().includes(query))
      );
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (user) => {
    setComment((prev) => prev.replace(/@[\w]*$/, `@${user.displayName} `));
    setShowMentions(false);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      const activityRef = doc(db, "activities", newTodo.id);
      const newComment = {
        text: comment,
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      };
      const updatedComments = [...(newTodo.comments || []), newComment];
      await updateDoc(activityRef, { comments: updatedComments });
      setNewTodo((prev) => ({
        ...prev,
        comments: updatedComments,
      }));
      await addDoc(collection(db, `activities/${newTodo.id}/history`), {
        action: `Comment added by ${currentUser.displayName || currentUser.email}`,
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      });
      setComment("");
      fetchDropdownData();
    } catch (err) {
      console.error(`Failed to add comment: ${err.message}`);
    }
  };

  const handleProfileClick = (module, id) => {
    alert(`Opening ${module} profile for ID: ${id}`);
  };

  return (
    <div className="bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
            {newTodo.id ? (isEditMode ? "Edit Task" : "View Task") : "Create Task"}
          </h2>
          <div className="flex items-center gap-2">
            {newTodo.id && !isEditMode && (
              <button
                onClick={() => setIsEditMode(true)}
                className="text-gray-500 hover:text-gray-700 text-lg"
              >
                ✏️
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                setIsDetailedForm(false);
              }}
              className="text-gray-500 hover:text-gray-700 text-lg"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              newTodo.status === "completed"
                ? "bg-green-100 text-green-700"
                : newTodo.status === "in progress"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Status: {newTodo.status.charAt(0).toUpperCase() + newTodo.status.slice(1)}
          </span>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm mb-4">{error}</div>
        )}

        {isEditMode ? (
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Task name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newTodo.name}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTodo.description}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-24 resize-y"
                  placeholder="Enter task description"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="assignees"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Assignees
                </label>
                <select
                  id="assignees"
                  name="assignees"
                  multiple
                  value={newTodo.assignees || []}
                  onChange={handleAssigneeChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.displayName}>
                      {user.displayName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="createdBy"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Created by
                </label>
                <input
                  id="createdBy"
                  type="text"
                  value={newTodo.createdBy}
                  readOnly
                  className="p-3 w-full border border-gray-300 rounded-md text-sm bg-gray-100 shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deadline
                </label>
                <input
                  type="text"
                  id="dueDate"
                  value={formatDateSafely(newTodo.dueDate)}
                  onClick={() => setIsDatePickerOpen(true)}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  readOnly
                />
                {isDatePickerOpen && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-lg p-4 mt-1 w-72 shadow-lg max-h-80 overflow-y-auto">
                    <div className="mb-4">
                      {predefinedDates.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handlePredefinedDateSelect(option.date)}
                          className="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                        >
                          {option.label}, {format(option.date, "EEEE, MMM d")}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <button
                        type="button"
                        onClick={() => handleMonthChange("prev")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        
                      </button>
                      <span className="text-sm font-medium">
                        {format(new Date(selectedYear, selectedMonth), "MMM yyyy")}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleMonthChange("next")}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        
                      </button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                        (day, index) => (
                          <div key={index} className="text-gray-500 font-medium">
                            {day}
                          </div>
                        )
                      )}
                      {emptyDays.map((_, index) => (
                        <div key={`empty-${index}`} />
                      ))}
                      {days.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() =>
                            handleDateSelect(new Date(selectedYear, selectedMonth, day))
                          }
                          className={`p-1 rounded-full hover:bg-blue-100 ${
                            day === new Date().getDate() &&
                            selectedMonth === new Date().getMonth() &&
                            selectedYear === new Date().getFullYear()
                              ? "bg-blue-500 text-white"
                              : "text-gray-700"
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="module" className="block text-sm font-medium text-gray-700 mb-1">
                  Module
                </label>
                <select
                  id="module"
                  name="module"
                  value={newTodo.module}
                  onChange={handleTodoChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="general">General</option>
                  <option value="enquiry">Enquiry</option>
                  <option value="company">Company</option>
                  <option value="student">Learner</option>
                  <option value="self">Self</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {newTodo.module === "enquiry" && (
                <div>
                  <label
                    htmlFor="enquiry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enquiry
                  </label>
                  <select
                    id="enquiry"
                    name="enquiry"
                    value={newTodo.enquiry}
                    onChange={handleTodoChange}
                    className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Enquiry</option>
                    {enquiries.map((enquiry) => (
                      <option key={enquiry.id} value={enquiry.name}>
                        {enquiry.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newTodo.module === "company" && (
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Company
                  </label>
                  <select
                    id="company"
                    name="company"
                    value={newTodo.company}
                    onChange={handleTodoChange}
                    className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newTodo.module === "student" && (
                <div>
                  <label
                    htmlFor="student"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Learner
                  </label>
                  <select
                    id="student"
                    name="student"
                    value={newTodo.student}
                    onChange={handleTodoChange}
                    className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Learner</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.Name}>
                        {student.Name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {newTodo.module === "self" && (
                <div>
                  <label
                    htmlFor="self"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Self
                  </label>
                  <input
                    id="self"
                    type="text"
                    value={currentUser.displayName || currentUser.email}
                    readOnly
                    className="p-3 w-full border border-gray-300 rounded-md text-sm bg-gray-100 shadow-sm"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="highPriority"
                  checked={newTodo.highPriority}
                  onChange={handleTodoChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">High Priority</span>
              </label>
            </div>

            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Add Comment
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  value={comment}
                  onChange={handleCommentChange}
                  className="p-3 w-full border border-gray-300 rounded-md text-sm shadow-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-24 resize-y"
                  placeholder="Add a comment..."
                />
                {showMentions && mentionSuggestions.length > 0 && (
                  <div className="absolute z-10 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto w-full">
                    {mentionSuggestions.map((user) => (
                      <div
                        key={user.id}
                        onClick={() => handleMentionSelect(user)}
                        className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        {user.displayName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleAddComment}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
              >
                Add Comment
              </button>
            </div>

            <div className="flex flex-wrap gap-2 justify-between items-center border-t pt-4">
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  {newTodo.id ? "Update task" : "Add task"}
                </button>
                {!newTodo.id && (
                  <button
                    type="button"
                    onClick={handleAddAnother}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                  >
                    Add task & create another one
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setIsDetailedForm(false);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
              {!newTodo.id && (
                <button
                  type="button"
                  onClick={() => setIsDetailedForm(false)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Simple form
                </button>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Task Name</h3>
              <p className="text-gray-900">{newTodo.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="text-gray-900">{newTodo.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Assignees</h3>
                <p className="text-gray-900">{(newTodo.assignees || []).join(", ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Created by</h3>
                <p className="text-gray-900">{newTodo.createdBy}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Deadline</h3>
                <p className="text-gray-900">{formatDateSafely(newTodo.dueDate)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">Module</h3>
                <p className="text-gray-900">{newTodo.module}</p>
              </div>
            </div>
            {newTodo.module !== "general" && newTodo.module !== "self" && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">
                  {newTodo.module.charAt(0).toUpperCase() + newTodo.module.slice(1)}
                </h3>
                <p
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => handleProfileClick(newTodo.module, newTodo[newTodo.module])}
                >
                  {newTodo[newTodo.module]}
                </p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-700">Priority</h3>
              <p className="text-gray-900">{newTodo.highPriority ? "High Priority" : "Normal"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">History</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {history.length > 0 ? (
                  history.map((entry) => (
                    <div key={entry.id} className="text-sm text-gray-600">
                      {entry.action} by {entry.user} at {formatDateSafely(entry.timestamp)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No history available.</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700">Comments</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(newTodo.comments || []).length > 0 ? (
                  newTodo.comments.map((comment, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <strong>{comment.user}</strong>: {comment.text} at{" "}
                      {formatDateSafely(comment.timestamp)}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-600">No comments available.</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {newTodo.status !== "completed" && (
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(newTodo.status === "in progress" ? "pending" : "in progress")
                  }
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
                >
                  {newTodo.status === "in progress" ? "Pause" : "Start"}
                </button>
              )}
              {newTodo.status !== "completed" && (
                <button
                  type="button"
                  onClick={() => handleStatusChange("completed")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                >
                  Finish
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsDetailedForm(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedForm;