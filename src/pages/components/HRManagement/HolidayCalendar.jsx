import React, { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, CalendarDays, AlertCircle, CheckCircle } from "lucide-react";
import { db } from "../../../config/firebase";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidayName, setHolidayName] = useState("");
  const [applicableFor, setApplicableFor] = useState("");
  const [description, setDescription] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());

  const canView = true;
  const canCreate = true;
  const canUpdate = true;
  const canDelete = true;

  // Fetch shifts from Firebase
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const shiftsCollection = collection(db, "Shifts");
        const shiftsSnapshot = await getDocs(shiftsCollection);
        const shiftsList = shiftsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setShifts(shiftsList);
        setError("");
      } catch (err) {
        setError("Failed to fetch shifts from database.");
        console.error("Error fetching shifts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  // Fetch holidays from Firebase
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        const holidaysCollection = collection(db, "Holiday");
        const holidaysSnapshot = await getDocs(holidaysCollection);
        const holidaysList = holidaysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHolidays(holidaysList);
        setError("");
      } catch (err) {
        setError("Failed to fetch holidays from database.");
        console.error("Error fetching holidays:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date) => {
    if (!canCreate && !canUpdate) {
      setError("You do not have permission to add or update holidays.");
      return;
    }
    const dateStr = formatLocalDate(date);
    setSelectedDate(dateStr);
    const existingHoliday = holidays.find((holiday) => holiday.date === dateStr);
    setHolidayName(existingHoliday ? existingHoliday.name || "" : "");
    setApplicableFor(existingHoliday ? existingHoliday.applicableFor || "" : "");
    setDescription(existingHoliday ? existingHoliday.description || "" : "");
    setError("");
    setSuccess("");
  };

  const handleAddHoliday = async () => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!holidayName.trim()) {
      setError("Please enter a holiday name.");
      return;
    }
    if (!applicableFor.trim()) {
      setError("Please select a shift or 'All Shifts'.");
      return;
    }

    const isAllShifts = applicableFor === "All Shifts";
    const selectedShift = isAllShifts ? null : shifts.find((shift) => shift.shiftName === applicableFor);

    if (!isAllShifts && !selectedShift) {
      setError("Selected shift not found.");
      return;
    }

    const isExistingHoliday = holidays.find((h) => h.date === selectedDate);
    try {
      setLoading(true);
      const holidayData = {
        name: holidayName.trim(),
        date: selectedDate,
        applicableFor: applicableFor.trim(),
        shiftId: isAllShifts ? "ALL" : selectedShift.id,
        description: description.trim(),
      };

      if (isExistingHoliday) {
        const holidayDoc = doc(db, "Holiday", isExistingHoliday.id);
        await updateDoc(holidayDoc, holidayData);
        setHolidays((prev) => [
          ...prev.filter((h) => h.date !== selectedDate),
          { id: isExistingHoliday.id, ...holidayData },
        ]);
      } else {
        const docRef = await addDoc(collection(db, "Holiday"), holidayData);
        setHolidays((prev) => [...prev, { id: docRef.id, ...holidayData }]);
      }

      setError("");
      setSuccess(`Holiday ${isExistingHoliday ? "updated" : "added"} successfully!`);
      setHolidayName("");
      setApplicableFor("");
      setDescription("");
      setSelectedDate(null);
    } catch (err) {
      setError(`Failed to ${isExistingHoliday ? "update" : "add"} holiday.`);
      console.error("Error saving holiday:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveHoliday = async () => {
    if (!canDelete) {
      setError("You do not have permission to remove holidays.");
      return;
    }
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    const holidayToDelete = holidays.find((h) => h.date === selectedDate);
    if (!holidayToDelete) {
      setError("No holiday found for the selected date.");
      return;
    }

    if (!window.confirm(`Are you sure you want to remove the holiday "${holidayToDelete.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      await deleteDoc(doc(db, "Holiday", holidayToDelete.id));
      setHolidays((prev) => prev.filter((h) => h.date !== selectedDate));
      setSuccess("Holiday removed successfully!");
      setError("");
      setHolidayName("");
      setApplicableFor("");
      setDescription("");
      setSelectedDate(null);
    } catch (err) {
      setError("Failed to remove holiday. Please try again.");
      console.error("Error removing holiday:", err);
    } finally {
      setLoading(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isHoliday = (date) => {
    if (!date) return false;
    const dateStr = formatLocalDate(date);
    return holidays.find((h) => h.date === dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return formatLocalDate(date) === selectedDate;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (!canView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Access Denied</h2>
          <p className="text-slate-600">You do not have permission to view holidays.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 p-4 h-full">
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 mb-6">
          <div className="flex items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl mr-4">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Holiday Calendar</h1>
              <p className="text-slate-600">Manage company holidays and events</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            {success}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-12">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-slate-600">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-800">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateMonth(-1)}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date())}
                      className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => navigateMonth(1)}
                      className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l-7 7 7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {weekDays.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded-lg">
                      {day}
                    </div>
                  ))}
                  {days.map((date, index) => {
                    const holiday = date ? isHoliday(date) : null;
                    const today = date ? isToday(date) : false;
                    const selected = date ? isSelected(date) : false;

                    return (
                      <div
                        key={index}
                        onClick={date ? () => handleDateClick(date) : undefined}
                        className={`
                          relative h-20 p-2 border border-slate-200 rounded-lg cursor-pointer transition-all duration-200
                          ${!date ? "cursor-default" : ""}
                          ${today ? "bg-blue-50 border-blue-300" : "hover:bg-slate-50"}
                          ${selected ? "bg-blue-100 border-blue-400" : ""}
                          ${holiday ? "bg-red-50 border-red-300" : ""}
                        `}
                      >
                        {date && (
                          <>
                            <div className={`text-sm font-medium ${today ? "text-blue-600" : "text-slate-700"}`}>
                              {date.getDate()}
                            </div>
                            {holiday && (
                              <div className="text-xs text-red-600 mt-1 leading-tight line-clamp-2">
                                {holiday.name}
                              </div>
                            )}
                            {today && (
                              <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 sticky top-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Holiday Management
                </h3>

                {selectedDate ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-800 mb-1">Selected Date</p>
                      <p className="text-blue-700">
                        {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {(canCreate || canUpdate) && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Holiday Name
                          </label>
                          <input
                            type="text"
                            value={holidayName}
                            onChange={(e) => setHolidayName(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            placeholder="Enter holiday name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Applicable For
                          </label>
                          <select
                            value={applicableFor}
                            onChange={(e) => setApplicableFor(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                          >
                            <option value="" disabled>Select a shift</option>
                            <option value="All Shifts">All Shifts</option>
                            {shifts.map((shift) => (
                              <option key={shift.id} value={shift.shiftName}>
                                {shift.shiftName}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Description
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                            placeholder="Enter holiday description"
                            rows="4"
                          />
                        </div>

                        <div className="flex flex-col space-y-3">
                          <button
                            onClick={handleAddHoliday}
                            disabled={loading}
                            className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            <Plus className="w-4 h-4" />
                            <span>{holidays.some((h) => h.date === selectedDate) ? "Update" : "Submit"}</span>
                          </button>

                          {canDelete && holidays.some((h) => h.date === selectedDate) && (
                            <button
                              onClick={handleRemoveHoliday}
                              disabled={loading}
                              className={`flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Remove Holiday</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">
                      Click on a date to add or manage holidays
                    </p>
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                    Holiday List
                  </h3>
                  {holidays.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-slate-500 text-sm">No holidays added yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {holidays
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .map((holiday) => (
                          <div
                            key={holiday.id}
                            className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex justify-between items-center"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-800">{holiday.name}</p>
                              <p className="text-xs text-slate-600">
                                {new Date(holiday.date + "T00:00:00").toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <button
                              onClick={() => handleDateClick(new Date(holiday.date))}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HolidayCalendar;