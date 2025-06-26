import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserOperation from '../../../pages/components/HRManagement/EmployeeAttendanceManagement';
import ARule from '../../../pages/components/HRManagement/ARule';
import HolidayCalendar from '../../../pages/components/HRManagement/HolidayCalendar';
import AttendanceDashboard from '../../../pages/components/HRManagement/AttendanceDashboard'; // Corrected import


export default function SimpleShiftManagement() {
  const [activeTab, setActiveTab] = useState('User Specific Operations');
  const navigate = useNavigate();

  const tabs = [
    'User Specific Operations',
    'Attendance Analysis', // Ensure this matches exactly
    'Attendance Rules',
    'Holiday Setup',
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
     <div className="flex flex-col min-h-screen bg-gray-50 p-2 fixed inset-0 lg:left-[300px] overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 rounded-xl shadow-xl mb-2 z-10">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <nav className="flex items-center space-x-1" role="tablist">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white/30 text-white shadow-lg border-2 border-white/50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {activeTab}
          </h2>

          {activeTab === 'User Specific Operations' && (
            <div className="animate-fadeIn">
              <UserOperation />
            </div>
          )}

          {activeTab === 'Attendance Analysis' && ( // Corrected tab name
            <div className="animate-fadeIn">
              <AttendanceDashboard /> 
            </div>
          )}

          {activeTab === 'Attendance Rules' && (
            <div className="animate-fadeIn">
              <ARule />
            </div>
          )}

          {activeTab === 'Holiday Setup' && (
            <div className="animate-fadeIn">
              <HolidayCalendar />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}