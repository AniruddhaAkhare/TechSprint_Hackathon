import React, { useState, useEffect } from "react";
import { collection, query, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { format, addDays, addWeeks, endOfMonth } from "date-fns";
import DetailedForm from "./DetailedForm";

const AddTask = ({ onClose, onTaskAdded }) => {
  const [isDetailedForm, setIsDetailedForm] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = auth.currentUser || { displayName: "Unknown User", email: "unknown@example.com" };
  const [newTodo, setNewTodo] = useState({
    name: "",
    description: "",
    module: "general",
    assignees: [],
    dueDate: "",
    highPriority: false,
    createdBy: "",
    status: "pending",
    enquiry: "",
    company: "",
    learner: "",
    history: [],
    comments: [],
  });

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, "Users"));
      const usersSnapshot = await getDocs(usersQuery);
      setUsers(usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      setError(`Failed to fetch users: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
    setNewTodo((prev) => ({
      ...prev,
      assignees: [currentUser.displayName || currentUser.email],
      createdBy: currentUser.displayName || currentUser.email,
    }));
  }, [currentUser]);

  // Handle new todo input changes
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

  // Add new todo
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.name.trim()) {
      setError("Task name is required.");
      return;
    }
    try {
      const activityData = {
        createdBy: newTodo.createdBy,
        assignees: newTodo.assignees,
        status: "pending",
        module: newTodo.module,
        dueDate: newTodo.dueDate || "",
        description: newTodo.description || "",
        name: newTodo.name,
        highPriority: newTodo.highPriority,
        enquiry: newTodo.module === "enquiry" ? newTodo.enquiry : "",
        company: newTodo.module === "company" ? newTodo.company : "",
        learner: newTodo.module === "learner" ? newTodo.learner : "",
        createdAt: new Date().toISOString(),
        pinned: false,
        history: [],
        comments: [],
      };
      await addDoc(collection(db, "activities"), activityData);
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
        learner: "",
        history: [],
        comments: [],
      });
      setIsDetailedForm(false);
      setError(null);
      onTaskAdded();
      onClose();
    } catch (err) {
      setError(`Failed to add activity: ${err.message}`);
    }
  };

  // Format date safely
  const formatDateSafely = (dateString) => {
    if (!dateString) return "No deadline";
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  // Date picker logic
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const lateThisWeek = addDays(today, 3);
  const inAWeek = addWeeks(today, 1);
  const lateNextMonth = endOfMonth(addDays(today, 30));

  const predefinedDates = [
    { label: "Today", date: today },
    { label: "Tomorrow", date: tomorrow },
    { label: "Late this week", date: lateThisWeek },
    { label: "In a week", date: inAWeek },
    { label: "Late next month", date: lateNextMonth },
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const handleDateSelect = (date) => {
    setNewTodo((prev) => ({ ...prev, dueDate: date.toISOString() }));
    setIsDatePickerOpen(false);
  };

  const handlePredefinedDateSelect = (date) => {
    handleDateSelect(date);
  };

  const handleMonthChange = (direction) => {
    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  return (
    <div className="bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={() => {
            onClose();
            setIsDetailedForm(false);
          }}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-lg font-medium mb-4">Create Task</h3>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        {!isDetailedForm ? (
          <form onSubmit={handleAddTodo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task name</label>
              <input
                type="text"
                name="name"
                value={newTodo.name}
                onChange={handleTodoChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                placeholder="Enter task name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={newTodo.description}
                onChange={handleTodoChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
                placeholder="Enter task description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignees</label>
              <select
                name="assignees"
                multiple
                value={newTodo.assignees}
                onChange={handleAssigneeChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              >
                {users.map((user) => (
                  <option key={user.id} value={user.displayName}>
                    {user.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input
                type="text"
                value={formatDateSafely(newTodo.dueDate)}
                onClick={() => setIsDatePickerOpen(true)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm cursor-pointer"
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
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                      <div key={index} className="text-gray-500 font-medium">
                        {day}
                      </div>
                    ))}
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
                          day === today.getDate() &&
                          selectedMonth === today.getMonth() &&
                          selectedYear === today.getFullYear()
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
              <label className="block text-sm font-medium text-gray-700">Module</label>
              <select
                name="module"
                value={newTodo.module}
                onChange={handleTodoChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md text-sm"
              >
                <option value="general">General</option>
                <option value="enquiry">Enquiry</option>
                <option value="company">Company</option>
                <option value="learner">Learner</option>
                <option value="self">Self</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="highPriority"
                  checked={newTodo.highPriority}
                  onChange={handleTodoChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">High Priority</span>
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add task
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsDetailedForm(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setIsDetailedForm(true)}
                className="px-4 py-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                Detailed form
              </button>
            </div>
          </form>
        ) : (
          <DetailedForm
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            onSubmit={handleAddTodo}
            onClose={() => {
              onClose();
              setIsDetailedForm(false);
            }}
            setIsDetailedForm={setIsDetailedForm}
            formatDateSafely={formatDateSafely}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            predefinedDates={predefinedDates}
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            daysInMonth={daysInMonth}
            firstDayOfMonth={firstDayOfMonth}
            days={days}
            emptyDays={emptyDays}
            handleDateSelect={handleDateSelect}
            handlePredefinedDateSelect={handlePredefinedDateSelect}
            handleMonthChange={handleMonthChange}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default AddTask;