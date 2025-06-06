import React, { useState, useEffect } from "react";
import { collection, query, getDocs, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db, auth } from "../../../config/firebase";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, subDays, subMonths, addDays } from "date-fns";
import { useLocation } from "react-router-dom";
import AddTask from "./AddTask";
import DetailedForm from "./DetailedForm";

const Activity = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailedFormOpen, setIsDetailedFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [filters, setFilters] = useState({
    module: "",
    status: "",
    timeFilter: "",
    startDate: "",
    endDate: "",
    sortBy: "dueDate",
    sortOrder: "asc",
    searchQuery: "",
    roleFilter: "both", // New filter for My Activities
  });
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const viewType = queryParams.get("view") || "all";
  const currentUser = auth.currentUser || { displayName: "Unknown User", email: "unknown@example.com" };

  // Fetch activities from Firestore
  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      const activitiesQuery = query(collection(db, "activities"));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const fetchedActivities = activitiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setActivities(
        fetchedActivities.map((activity) => ({
          id: activity.id,
          createdBy: activity.createdBy || "Unknown User",
          assignees: activity.assignees || ["Unassigned"],
          status: activity.status || "pending",
          module: activity.module || "general",
          dueDate: activity.dueDate || "",
          description: activity.description || "",
          name: activity.name || activity.description || "",
          highPriority: activity.highPriority || false,
          createdAt: activity.createdAt || "",
          pinned: activity.pinned || false,
          enquiry: activity.enquiry || "",
          company: activity.company || null,
          learner: activity.learner || "",
          history: activity.history || [],
          comments: activity.comments || [],
        }))
      );
      setError(null);
    } catch (err) {
      setError(`Failed to fetch activities: ${err.message}`);
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search query
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  // Toggle activity status
  const handleToggleStatus = async (activity) => {
    try {
      const newStatus = activity.status === "completed" ? "pending" : "completed";
      const activityRef = doc(db, "activities", activity.id);
      await updateDoc(activityRef, { status: newStatus });
      await addDoc(collection(db, `activities/${activity.id}/history`), {
        action: `Status changed to ${newStatus}`,
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      });
      setActivities((prev) =>
        prev.map((act) =>
          act.id === activity.id ? { ...act, status: newStatus } : act
        )
      );
      setError(null);
    } catch (err) {
      setError(`Failed to update status: ${err.message}`);
    }
  };

  // Handle row click to open detailed form
  const handleRowClick = (activity) => {
    setSelectedActivity(activity);
    setIsDetailedFormOpen(true);
  };

  // Handle right-click to show context menu
  const handleRightClick = (e, activity) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      activity: activity,
    });
  };

  // Close context menu
  const closeContextMenu = () => {
    setContextMenu(null);
  };

  // Handle delete activity
  const handleDeleteActivity = async (activityId) => {
    try {
      const activityRef = doc(db, "activities", activityId);
      await deleteDoc(activityRef);
      setActivities((prev) => prev.filter((act) => act.id !== activityId));
      setError(null);
      closeContextMenu();
    } catch (err) {
      setError(`Failed to delete activity: ${err.message}`);
    }
  };

  // Handle pin activity
  const handlePinActivity = async (activity) => {
    try {
      const newPinnedStatus = !activity.pinned;
      const activityRef = doc(db, "activities", activity.id);
      await updateDoc(activityRef, { pinned: newPinnedStatus });
      await addDoc(collection(db, `activities/${activity.id}/history`), {
        action: newPinnedStatus ? "Pinned activity" : "Unpinned activity",
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      });
      setActivities((prev) =>
        prev.map((act) =>
          act.id === activity.id ? { ...act, pinned: newPinnedStatus } : act
        )
      );
      setError(null);
      closeContextMenu();
    } catch (err) {
      setError(`Failed to pin activity: ${err.message}`);
    }
  };

  // Update activity from DetailedForm
  const handleUpdateActivity = async (e) => {
    e.preventDefault();
    if (!selectedActivity.name.trim()) {
      setError("Task name is required.");
      return;
    }
    try {
      const activityRef = doc(db, "activities", selectedActivity.id);
      const updatedActivity = {
        ...selectedActivity,
        name: selectedActivity.name,
        description: selectedActivity.description,
      };
      await updateDoc(activityRef, updatedActivity);
      await addDoc(collection(db, `activities/${selectedActivity.id}/history`), {
        action: "Activity updated",
        user: currentUser.displayName || currentUser.email,
        timestamp: new Date().toISOString(),
      });
      setActivities((prev) =>
        prev.map((act) =>
          act.id === selectedActivity.id ? { ...act, ...updatedActivity } : act
        )
      );
      setIsDetailedFormOpen(false);
      setSelectedActivity(null);
      setError(null);
    } catch (err) {
      setError(`Failed to update activity: ${err.message}`);
    }
  };

  // Filter and sort activities
  const filteredActivities = activities
    .filter((activity) => {
      const userIdentifier = currentUser.displayName || currentUser.email;
      const isCreator = activity.createdBy === userIdentifier;
      const isAssignee = (activity.assignees || []).includes(userIdentifier);

      // View type filter
      if (viewType === "my") {
        if (filters.roleFilter === "assignee" && !isAssignee) return false;
        if (filters.roleFilter === "createdBy" && !isCreator) return false;
        if (filters.roleFilter === "both" && !isCreator && !isAssignee) return false;
      } else if (viewType === "dueToday") {
        if (!isAssignee) return false;
        const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
        if (!dueDate) return false;
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());
        return dueDate >= todayStart && dueDate <= todayEnd;
      }
      // viewType === "all" shows all activities, no user filter

      // Additional filters
      if (filters.module && activity.module !== filters.module) return false;
      if (filters.status && activity.status !== filters.status) return false;
      if (filters.searchQuery && !activity.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false;
      if (filters.timeFilter) {
        const dueDate = activity.dueDate ? new Date(activity.dueDate) : null;
        if (!dueDate) return false;
        const now = new Date();
        if (filters.timeFilter === "today") {
          const todayStart = startOfDay(now);
          const todayEnd = endOfDay(now);
          return dueDate >= todayStart && dueDate <= todayEnd;
        } else if (filters.timeFilter === "yesterday") {
          const yesterday = subDays(now, 1);
          const yesterdayStart = startOfDay(yesterday);
          const yesterdayEnd = endOfDay(yesterday);
          return dueDate >= yesterdayStart && dueDate <= yesterdayEnd;
        } else if (filters.timeFilter === "tomorrow") {
          const tomorrow = addDays(now, 1);
          const tomorrowStart = startOfDay(tomorrow);
          const tomorrowEnd = endOfDay(tomorrow);
          return dueDate >= tomorrowStart && dueDate <= tomorrowEnd;
        } else if (filters.timeFilter === "thisMonth") {
          const monthStart = startOfMonth(now);
          const monthEnd = endOfMonth(now);
          return dueDate >= monthStart && dueDate <= monthEnd;
        } else if (filters.timeFilter === "lastMonth") {
          const lastMonth = subMonths(now, 1);
          const lastMonthStart = startOfMonth(lastMonth);
          const lastMonthEnd = endOfMonth(lastMonth);
          return dueDate >= lastMonthStart && dueDate <= lastMonthEnd;
        } else if (filters.timeFilter === "custom") {
          if (!filters.startDate || !filters.endDate) return true;
          const start = startOfDay(new Date(filters.startDate));
          const end = endOfDay(new Date(filters.endDate));
          return dueDate >= start && dueDate <= end;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      const aValue = a[filters.sortBy] || "";
      const bValue = b[filters.sortBy] || "";
      if (filters.sortBy === "dueDate" || filters.sortBy === "createdAt") {
        const aDate = aValue ? new Date(aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue) : new Date(0);
        return filters.sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      }
      return filters.sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

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

  // Date picker logic for DetailedForm
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const lateThisWeek = addDays(today, 3);
  const inAWeek = addDays(today, 7);
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
    setSelectedActivity((prev) => ({ ...prev, dueDate: date.toISOString() }));
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

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const handleProfileClick = (module, id) => {
    alert(`Opening ${module} profile for ID: ${id}`);
  };

  return (
    <div className="bg-gray-50 p-4 fixed inset-0 left-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {viewType === "all" ? "All Activities" : viewType === "my" ? "My Activities" : "Due Today"}
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <span>Create</span>
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded-md text-sm w-64"
        />
        <select
          name="module"
          value={filters.module}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All modules</option>
          <option value="general">General</option>
          <option value="enquiry">Enquiry</option>
          <option value="company">Company</option>
          <option value="learner">Learner</option>
          <option value="self">Self</option>
        </select>
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          name="timeFilter"
          value={filters.timeFilter}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">All time</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="yesterday">Yesterday</option>
          <option value="thisMonth">This month</option>
          <option value="lastMonth">Last month</option>
          <option value="custom">Custom range</option>
        </select>
        {filters.timeFilter === "custom" && (
          <>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-md text-sm"
            />
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="p-2 border border-gray-300 rounded-md text-sm"
            />
          </>
        )}
        {viewType === "my" && (
          <select
            name="roleFilter"
            value={filters.roleFilter}
            onChange={handleFilterChange}
            className="p-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="both">Both</option>
            <option value="assignee">Assignee</option>
            <option value="createdBy">Created By</option>
          </select>
        )}
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="dueDate">Due date</option>
          <option value="createdAt">Created at</option>
          <option value="module">Module</option>
          <option value="status">Status</option>
        </select>
        <select
          name="sortOrder"
          value={filters.sortOrder}
          onChange={handleFilterChange}
          className="p-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      {isModalOpen && (
        <AddTask
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={fetchActivities}
        />
      )}

      {isDetailedFormOpen && selectedActivity && (
        <DetailedForm
          newTodo={selectedActivity}
          setNewTodo={setSelectedActivity}
          onSubmit={handleUpdateActivity}
          onClose={() => {
            setIsDetailedFormOpen(false);
            setSelectedActivity(null);
          }}
          setIsDetailedForm={() => setIsDetailedFormOpen(false)}
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

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading activities...</p>
      ) : activities.length === 0 ? (
        <p className="text-sm text-gray-600">No activities found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">
                  Toggle
                </th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Name</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Deadline</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Created by</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Assignees</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Module</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Tags</th>
                <th className="border border-gray-200 p-2 text-sm font-medium text-gray-700 text-left">Pinned</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className={`hover:bg-gray-50 cursor-pointer ${activity.pinned ? "bg-yellow-50" : ""}`}
                  onClick={() => handleRowClick(activity)}
                  onContextMenu={(e) => handleRightClick(e, activity)}
                >
                  <td className="border border-gray-200 p-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      onChange={() => handleToggleStatus(activity)}
                      checked={activity.status === "completed"}
                    />
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {activity.name}
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {formatDateSafely(activity.dueDate)}
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {activity.createdBy}
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {(activity.assignees || []).join(", ")}
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {activity.module === "learner" ? "Learner" : activity.module.charAt(0).toUpperCase() + activity.module.slice(1)}
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${
                        activity.highPriority
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {activity.highPriority ? "High Priority" : "Normal"}
                    </span>
                  </td>
                  <td className="border border-gray-200 p-2 text-sm text-gray-900">
                    {activity.pinned ? "Pinned" : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-md shadow-lg z-50"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={closeContextMenu}
        >
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handleDeleteActivity(contextMenu.activity.id)}
          >
            Delete
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => handlePinActivity(contextMenu.activity)}
          >
            {contextMenu.activity.pinned ? "Unpin" : "Pin"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Activity;