import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

const EmployeeTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [shiftData, setShiftData] = useState({
    shiftName: "",
    fromTime: "",
    toTime: "",
    marginBefore: "",
    marginAfter: "",
    payableHoursRange: "",
    coreWorkingHours: "",
  });

  const [shifts, setShifts] = useState([]);
  const [users, setUsers] = useState([]);

  const shiftsCollectionRef = collection(db, "Shifts");
  const usersCollectionRef = collection(db, "Users");

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const q = query(shiftsCollectionRef, orderBy("shiftName", "asc"));
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShifts(list);
      } catch (err) {
        console.error("Error fetching shifts:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const snapshot = await getDocs(usersCollectionRef);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchShifts();
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShiftData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await addDoc(shiftsCollectionRef, shiftData);
      alert("Shift saved successfully!");

      setShiftData({
        shiftName: "",
        fromTime: "",
        toTime: "",
        marginBefore: "",
        marginAfter: "",
        payableHoursRange: "",
        coreWorkingHours: "",
      });

      const q = query(shiftsCollectionRef, orderBy("shiftName", "asc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setShifts(list);
      setShowForm(false);
    } catch (error) {
      alert("Failed to save shift.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 font-sans">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Employee Management
      </h1>

      {/* Employee Dropdown Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Employee</h2>
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Select Employee
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Choose an employee...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.displayName || user.email || "Unknown User"}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 min-w-[200px]">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">
              Total Employees
            </h3>
            <div className="text-3xl font-bold text-indigo-600">
              {users.length}
            </div>
            <p className="text-sm text-indigo-600 mt-1">
              {users.length === 1 ? "Employee" : "Employees"} registered
            </p>
          </div>
        </div>
      </div>

      {/* Shift Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Shifts</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition text-sm font-medium"
          >
            {showForm ? "Cancel" : "Create Shift"}
          </button>
        </div>

        {/* Shift Form Card */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6 shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Create New Shift
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Shift Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="shiftName"
                  value={shiftData.shiftName}
                  onChange={handleChange}
                  placeholder="General at 10"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  From (Start)
                </label>
                <input
                  type="time"
                  name="fromTime"
                  value={shiftData.fromTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  To (End)
                </label>
                <input
                  type="time"
                  name="toTime"
                  value={shiftData.toTime}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Shift Margin Before
                </label>
                <input
                  type="text"
                  name="marginBefore"
                  value={shiftData.marginBefore}
                  onChange={handleChange}
                  placeholder="01:00"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Shift Margin After
                </label>
                <input
                  type="text"
                  name="marginAfter"
                  value={shiftData.marginAfter}
                  onChange={handleChange}
                  placeholder="01:00"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Payable Hours Range
                </label>
                <input
                  type="text"
                  name="payableHoursRange"
                  value={shiftData.payableHoursRange}
                  onChange={handleChange}
                  placeholder="09:00 AM - 08:00 PM"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Core Working Hours
                </label>
                <input
                  type="text"
                  name="coreWorkingHours"
                  value={shiftData.coreWorkingHours}
                  onChange={handleChange}
                  placeholder="7.5"
                  className="w-full p-3 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition text-sm font-medium"
              >
                Save Shift
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Shifts Display Section */}
        <div>
          {shifts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No shifts created yet.</p>
              <p className="text-sm">Click "Create Shift" to add your first shift.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map((shift) => (
                <div
                  key={shift.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 text-lg">
                      {shift.shiftName}
                    </h4>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {shift.fromTime} - {shift.toTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    Margin: {shift.marginBefore} / {shift.marginAfter}
                  </p>
                  <p className="text-sm text-gray-600">
                    Payable: {shift.payableHoursRange}
                  </p>
                  <p className="text-sm text-gray-600">
                    Core: {shift.coreWorkingHours} hrs
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTab;
