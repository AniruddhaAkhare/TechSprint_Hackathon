/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ShiftTab from '../../../pages/components/HRManagement/component/ShiftTab'; // Make sure this path is correct
import UserSpecific from '../../../pages/components/HRManagement/component/userSpecific'
export default function SimpleShiftManagement() {
  const [activeTab, setActiveTab] = useState('Shift');

  const tabs = [
    'Shift',
    'User-specific Operations',
    'Manage Shifts',
    'Employee Shift Mapping'
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2 fixed inset-0 left-[300px] overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 rounded-xl shadow-xl mb-2">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>

              <nav className="flex items-center space-x-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-white/20 text-white shadow-lg'
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

          {/* Conditionally Render Components */}
          {activeTab === 'Shift' && (
            <div className="animate-fadeIn">
              <ShiftTab />
            </div>
          )}

            {activeTab === 'User-specific Operations' && (
            <div className="animate-fadeIn">
              <UserSpecific />
            </div>
          )}

          {activeTab !== 'Shift' && (
            <div className="text-gray-600">
              Content for "{activeTab}" will be available soon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
