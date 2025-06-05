import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LeaveApproval from '../../../pages/components/HRManagement/Leave/HRLeaveApproval';
import LeaveType from  '../../../pages/components/HRManagement/Leave/LeaveType'
import LeavePolicy from  '../../../pages/components/HRManagement/Leave/LeavePolicy'
import EmployeLeave from '../../../pages/components/HRManagement/Leave/EmployeeLeave'
import LeaveCalendre from '../../../pages/components/HRManagement/LeaveCalendre'
export default function SimpleShiftManagement() {
  const [activeTab, setActiveTab] = useState('User-specific Operations');
  const navigate = useNavigate();

  const tabs = [
    'User-specific Operations',
    'Leave Approval',
    'Audit & Report',
    'Define Leave Type',
    'Leave Policy',
  ];

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2 fixed inset-0 lg:left-[300px] overflow-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-700 rounded-xl shadow-xl mb-2">
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

          {activeTab === 'User-specific Operations' && (
            <div className="animate-fadeIn">
            < EmployeLeave />
            </div>
          )}

          {activeTab === 'Leave Approval' && (
            <div className="animate-fadeIn">
            <LeaveApproval/>
            </div>
          )}

          {activeTab === 'Audit & Report' && (
            <div className="animate-fadeIn">
              <LeaveCalendre/>
            </div>
          )}

          {activeTab === 'Define Leave Type' && (
            <div className="animate-fadeIn">
           < LeaveType/>
            </div>
          )}

          {activeTab === 'Leave Policy' && (
            <div className="animate-fadeIn">
            <LeavePolicy/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
