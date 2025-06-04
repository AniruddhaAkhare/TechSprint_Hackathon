import React, { useState, useEffect } from "react";
import { Plus, Clock, Edit2 } from "lucide-react";
import { collection, addDoc, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../../config/firebase";

const ShiftManager = () => {
  const [shiftData, setShiftData] = useState({
    shiftName: "",
    fromTime: "",
    fromAmPm: "AM",
    toTime: "",
    toAmPm: "PM",
    marginBefore: "",
    marginAfter: "",
    coreWorkingHours: "",
  });
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingShiftId, setEditingShiftId] = useState(null);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        setLoading(true);
        const shiftsCollection = collection(db, "Shifts");
        const shiftsSnapshot = await getDocs(shiftsCollection);
        const shiftsList = shiftsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShifts(shiftsList);
        setLoading(false);
      } catch (error) {
        setError(`Failed to fetch shifts: ${error.message}`);
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const handleChange = (e) => {
    setShiftData({ ...shiftData, [e.target.name]: e.target.value });
  };

  const handleEdit = (shift) => {
    setShiftData({
      shiftName: shift.shiftName,
      fromTime: shift.fromTime,
      fromAmPm: shift.fromAmPm,
      toTime: shift.toTime,
      toAmPm: shift.toAmPm,
      marginBefore: shift.marginBefore.toString(),
      marginAfter: shift.marginAfter.toString(),
      coreWorkingHours: shift.coreWorkingHours,
    });
    setEditingShiftId(shift.id);
  };

  const handleSave = async () => {
    try {
      if (!shiftData.shiftName) {
        alert("Shift Name is required!");
        return;
      }
      if (!shiftData.fromTime || !shiftData.toTime) {
        alert("From Time and To Time are required!");
        return;
      }
      if (!shiftData.coreWorkingHours) {
        alert("Core Working Hours is required!");
        return;
      }
      if (!shiftData.marginBefore || !shiftData.marginAfter) {
        alert("Margin Before and Margin After are required!");
        return;
      }
      if (isNaN(shiftData.marginBefore) || isNaN(shiftData.marginAfter)) {
        alert("Margins must be valid numbers!");
        return;
      }
      if (
        parseFloat(shiftData.marginBefore) < 0 ||
        parseFloat(shiftData.marginAfter) < 0
      ) {
        alert("Margins cannot be negative!");
        return;
      }

      const newShift = {
        ...shiftData,
        marginBefore: parseFloat(shiftData.marginBefore),
        marginAfter: parseFloat(shiftData.marginAfter),
        createdAt: new Date().toISOString(),
      };

      if (editingShiftId) {
        const shiftRef = doc(db, "Shifts", editingShiftId);
        await updateDoc(shiftRef, newShift);
        setShifts((prev) =>
          prev.map((shift) =>
            shift.id === editingShiftId ? { id: editingShiftId, ...newShift } : shift
          )
        );
        setEditingShiftId(null);
      } else {
        const docRef = await addDoc(collection(db, "Shifts"), newShift);
        setShifts((prev) => [...prev, { id: docRef.id, ...newShift }]);
      }

      setShiftData({
        shiftName: "",
        fromTime: "",
        fromAmPm: "AM",
        toTime: "",
        toAmPm: "PM",
        marginBefore: "",
        marginAfter: "",
        coreWorkingHours: "",
      });
    } catch (error) {
      alert(`Failed to save shift: ${error.message}`);
    }
  };

  const formatTime = (time, period) => {
    if (!time || !time.includes(":")) {
      return time || "N/A";
    }
    if (!period) {
      period = "AM";
    }
    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      if (isNaN(hour)) {
        return time;
      }
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return time || "N/A";
    }
  };

  return (
    <div className="flex flex-col space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Shift Management</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Create Shift Card */}
        <div className="bg-white shadow-md rounded-xl border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-xl">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {editingShiftId ? "Edit Shift" : "Create New Shift"}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Shift Name
              </label>
              <input
                type="text"
                name="shiftName"
                value={shiftData.shiftName}
                onChange={handleChange}
                placeholder="Morning Shift"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  From Time
                </label>
                <input
                  type="time"
                  name="fromTime"
                  value={shiftData.fromTime}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">
                  AM/PM
                </label>
                <select
                  name="fromAmPm"
                  value={shiftData.fromAmPm}
                  onChange={handleChange}
                  className="mt-1 w-full px-2 py-2 border rounded-md"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  To Time
                </label>
                <input
                  type="time"
                  name="toTime"
                  value={shiftData.toTime}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="w-20">
                <label className="block text-sm font-medium text-gray-700">
                  AM/PM
                </label>
                <select
                  name="toAmPm"
                  value={shiftData.toAmPm}
                  onChange={handleChange}
                  className="mt-1 w-full px-2 py-2 border rounded-md"
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Margin Before (min)
                </label>
                <input
                  type="number"
                  name="marginBefore"
                  value={shiftData.marginBefore}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Margin After (min)
                </label>
                <input
                  type="number"
                  name="marginAfter"
                  value={shiftData.marginAfter}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                />
              </div>
            </div>
           
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Core Working Hours
              </label>
              <input
                type="text"
                name="coreWorkingHours"
                value={shiftData.coreWorkingHours}
                onChange={handleChange}
                placeholder="e.g., 8"
                className="mt-1 w-full px-4 py-2 border rounded-md"
              />
            </div>
            <button
              onClick={handleSave}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
            >
              {editingShiftId ? "Update Shift" : "Save Shift"}
            </button>
          </div>
        </div>
        <div className="md:col-span-1 lg:col-span-2 space-y-6">
          {loading ? (
            <div className="text-center text-gray-600">Loading shifts...</div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : shifts.length === 0 ? (
            <div className="bg-white shadow-md border border-gray-200 rounded-xl p-4 text-center">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No shifts created yet
              </h3>
              <p className="text-gray-500">
                Create your first shift using the form
              </p>
            </div>
          ) : (
            shifts.map((shift) => (
              <div
                key={shift.id}
                className="bg-white shadow-md border border-gray-200 rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    {shift.shiftName}
                  </h3>
                  <button
                    onClick={() => handleEdit(shift)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  <strong>Time:</strong>{" "}
                  {formatTime(shift.fromTime, shift.fromAmPm)} -{" "}
                  {formatTime(shift.toTime, shift.toAmPm)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Margins:</strong> Before {shift.marginBefore} min, After{" "}
                  {shift.marginAfter} min
                </p>
               
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiftManager;