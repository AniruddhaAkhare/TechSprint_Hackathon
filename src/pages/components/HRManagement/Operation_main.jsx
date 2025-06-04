import {
  Search,
  CalendarX, // <-- Add this
  Calendar,
  Users,
  FileText,
  CheckSquare,
  FileCheck
} from "lucide-react";

import { Link } from "react-router-dom";


const ServiceCard = ({ icon: Icon, title, iconColor, route }) => (
  <Link to={route}>
    <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full h-40 flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div className={`mb-2 ${iconColor}`}>
          <Icon size={32} />
        </div>
        <span className="text-sm font-medium text-gray-700 leading-tight break-words w-24 text-center">
          {title}
        </span>
      </div>
    </div>
  </Link>
);



export default function OperationsDashboard() {
  const services = [
    { icon: CalendarX, title: "Leave Application", iconColor: "text-blue-500", route: "/leave-application" },
    { icon: Users, title: "My Shift", iconColor: "text-blue-400", route: "/myShift" }, // Shift renamed
    { icon: FileText, title: "Assessment", iconColor: "text-pink-500", route: "/assessment" },
    { icon: CheckSquare, title: "Tasks", iconColor: "text-red-500", route: "/tasks" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-2 fixed inset-0 left-[300px] overflow-auto">
      {/* Header */}
      <header className="bg-slate-700 text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Operations</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search Operations"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-6">Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                iconColor={service.iconColor}
                route={service.route}
              />
            ))}
          </div>
        </div>

        {/* Optional Last Icon Card */}
      </div>
    </div>
  );
}
