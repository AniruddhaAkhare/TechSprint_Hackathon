import React, { useState, useEffect } from "react";
import { Plus, Clock, Settings, Calendar } from "lucide-react";

const ShiftManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [shiftData, setShiftData] = useState({
    shiftName: "",
    fromTime: "",
    toTime: "",
    marginBefore: "",
    marginAfter: "",
    payableHoursRange: "",
    coreWorkingHours: "",
  });

  const [shifts, setShifts] = useState([
    {
      id: 1,
      shiftName: "Morning Shift",
      fromTime: "09:00",
      toTime: "17:00",
      marginBefore: "01:00",
      marginAfter: "01:00",
      payableHoursRange: "09:00 AM - 05:00 PM",
      coreWorkingHours: "8"
    },
    {
      id: 2,
      shiftName: "Evening Shift",
      fromTime: "14:00",
      toTime: "22:00",
      marginBefore: "00:30",
      marginAfter: "00:30",
      payableHoursRange: "02:00 PM - 10:00 PM",
      coreWorkingHours: "8"
    }
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShiftData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const newShift = {
        id: Date.now(),
        ...shiftData
      };
      
      setShifts(prev => [...prev, newShift]);
      
      setShiftData({
        shiftName: "",
        fromTime: "",
        toTime: "",
        marginBefore: "",
        marginAfter: "",
        payableHoursRange: "",
        coreWorkingHours: "",
      });

      setShowForm(false);
    } catch (error) {
      console.error("Error saving shift:", error);
    }
  };

  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shift Management
            </h1>
          </div>
          <p className="text-gray-600">
            Create and manage work shifts for your organization
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Shifts</p>
                <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shifts</p>
                <p className="text-2xl font-bold text-green-600">{shifts.length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Hours</p>
                <p className="text-2xl font-bold text-purple-600">
                  {shifts.length > 0 
                    ? (shifts.reduce((acc, shift) => acc + parseFloat(shift.coreWorkingHours || 0), 0) / shifts.length).toFixed(1)
                    : '0'
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Shift Form Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Create New Shift
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shift Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="shiftName"
                    value={shiftData.shiftName}
                    onChange={handleChange}
                    placeholder="e.g., Morning Shift"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="fromTime"
                      value={shiftData.fromTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="toTime"
                      value={shiftData.toTime}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margin Before
                    </label>
                    <input
                      type="text"
                      name="marginBefore"
                      value={shiftData.marginBefore}
                      onChange={handleChange}
                      placeholder="01:00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Margin After
                    </label>
                    <input
                      type="text"
                      name="marginAfter"
                      value={shiftData.marginAfter}
                      onChange={handleChange}
                      placeholder="01:00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payable Hours Range
                  </label>
                  <input
                    type="text"
                    name="payableHoursRange"
                    value={shiftData.payableHoursRange}
                    onChange={handleChange}
                    placeholder="09:00 AM - 05:00 PM"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Core Working Hours
                  </label>
                  <input
                    type="text"
                    name="coreWorkingHours"
                    value={shiftData.coreWorkingHours}
                    onChange={handleChange}
                    placeholder="8"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Shift
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Shifts Display Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Active Shifts
              </h2>
              <p className="text-gray-600">
                Manage your organization's work shifts
              </p>
            </div>

            {shifts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No shifts created yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first shift using the form on the left
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {shifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {shift.shiftName}
                          </h3>
                          <div className="flex items-center gap-2 text-lg font-medium text-indigo-600">
                            <Clock className="w-4 h-4" />
                            {formatTime(shift.fromTime)} - {formatTime(shift.toTime)}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">Margin Before/After</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {shift.marginBefore} / {shift.marginAfter}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-sm font-medium text-gray-600">Payable Hours</span>
                          <span className="text-sm text-gray-900 font-medium">
                            {shift.payableHoursRange}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-gray-600">Core Working Hours</span>
                          <span className="text-sm font-bold text-indigo-600">
                            {shift.coreWorkingHours} hrs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShiftManagement;