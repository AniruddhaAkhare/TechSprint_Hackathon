import React, { useState, useEffect } from "react";
import { db } from "../../../config/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "../../../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/solid";

// Custom CSS for calendar styling
const customStyles = `
  .react-calendar {
    width: 100%;
    max-width: 800px;
    height: 600px;
    font-size: 1.25rem;
    line-height: 1.5;
    border: none;
    background: transparent;
  }
  .react-calendar__tile {
    height: 80px;
    padding: 10px;
    border-radius: 8px;
    transition: background 0.2s;
  }
  .react-calendar__month-view__days__day {
    font-size: 1.1rem;
    color: #374151;
  }
  .react-calendar__navigation {
    margin-bottom: 1rem;
  }
  .react-calendar__navigation__label,
  .react-calendar__navigation__arrow {
    font-size: 1.5rem;
    padding: 10px;
    color: #1f2937;
    border-radius: 8px;
  }
  .react-calendar__month-view__weekdays__weekday {
    font-size: 1.2rem;
    color: #6b7280;
    font-weight: 500;
  }
  .react-calendar__tile--active,
  .react-calendar__tile--hover {
    background: #e0f7fa !important;
  }
  .react-calendar__tile--now {
    background: #f3f4f6 !important;
  }
  .react-calendar__tile:enabled:hover {
    background: #e5e7eb !important;
  }
`;

const HolidayCalendar = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [holidayName, setHolidayName] = useState("");

  // Fetch holidays from Firestore
  useEffect(() => {
    const fetchHolidays = async () => {
      setLoading(true);
      setError("");
      try {
        const holidaysSnapshot = await getDocs(collection(db, "Holidays"));
        const holidaysData = holidaysSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHolidays(holidaysData);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        setError("Failed to load holidays.");
      }
      setLoading(false);
    };

    if (user) {
      fetchHolidays();
    }
  }, [user]);

  // Format date to YYYY-MM-DD in local timezone
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Handle date click on calendar
  const handleDateClick = (date) => {
    const dateStr = formatLocalDate(date);
    setSelectedDate(dateStr);
    const existingHoliday = holidays.find((holiday) => holiday.date === dateStr);
    setHolidayName(existingHoliday ? existingHoliday.name || "" : "");
  };

  // Add or update a holiday
  const handleAddHoliday = async () => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }
    if (!holidayName.trim()) {
      setError("Please enter a holiday name.");
      return;
    }

    try {
      const holidayDocId = selectedDate;
      await setDoc(doc(db, "Holidays", holidayDocId), {
        date: selectedDate,
        name: holidayName.trim(),
      });
      setHolidays((prev) => [
        ...prev.filter((h) => h.date !== selectedDate),
        { id: holidayDocId, date: selectedDate, name: holidayName.trim() },
      ]);
      setError("");
      setHolidayName("");
      setSelectedDate(null);
    } catch (err) {
      console.error("Error adding holiday:", err);
      setError("Failed to add holiday.");
    }
  };

  // Remove a holiday
  const handleRemoveHoliday = async () => {
    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    try {
      await deleteDoc(doc(db, "Holidays", selectedDate));
      setHolidays((prev) => prev.filter((h) => h.date !== selectedDate));
      setError("");
      setHolidayName("");
      setSelectedDate(null);
    } catch (err) {
      console.error("Error removing holiday:", err);
      setError("Failed to remove holiday.");
    }
  };

  // Customize calendar tile content to show holiday names
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatLocalDate(date);
      const holiday = holidays.find((h) => h.date === dateStr);
      if (holiday) {
        return (
          <div className="text-center text-red-600 text-xs mt-1">
            {holiday.name}
          </div>
        );
      }
    }
    return null;
  };

  // Customize tile class for holiday styling
  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const dateStr = formatLocalDate(date);
      const isHoliday = holidays.some((h) => h.date === dateStr);
      return isHoliday ? "bg-red-100 rounded-full" : "";
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Holiday Calendar</h3>
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Calendar */}
              <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-lg shadow-md p-4">
                  <style>{customStyles}</style>
                  <Calendar
                    onClickDay={handleDateClick}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="w-full"
                  />
                </div>
              </div>
              {/* Holiday Form */}
              <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedDate
                      ? `Manage Holiday for ${new Date(selectedDate).toLocaleDateString()}`
                      : "Select a Date"}
                  </h4>
                  {selectedDate && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="holidayName" className="block text-sm font-medium text-gray-700">
                          Holiday Name
                        </label>
                        <input
                          type="text"
                          id="holidayName"
                          value={holidayName}
                          onChange={(e) => setHolidayName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Christmas Day"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleAddHoliday}
                          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                        >
                          <PlusCircleIcon className="w-5 h-5 mr-2" />
                          {holidayName && holidays.some((h) => h.date === selectedDate)
                            ? "Update Holiday"
                            : "Add Holiday"}
                        </button>
                        {holidays.some((h) => h.date === selectedDate) && (
                          <button
                            onClick={handleRemoveHoliday}
                            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
                          >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            Remove Holiday
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayCalendar;