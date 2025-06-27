import React from 'react';
import Sidebar from '../pages/home/Sidebar.jsx'; // Assuming it's already styled

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md z-10 flex-shrink-0 overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Main Area (Header + Content + Footer) */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header Placeholder */}
        <header className="h-16 bg-white shadow flex items-center px-6 text-lg font-semibold text-gray-800">
          {/* Replace with actual Header component */}
          Header (Coming Soon)
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-6 py-4 bg-gray-50">
          {children}
        </main>

        {/* Footer / Taskbar Placeholder */}
        <footer className="h-12 bg-white border-t shadow-inner flex items-center justify-center text-sm text-gray-500">
          {/* Replace with actual taskbar later */}
          Taskbar / Footer (Coming Soon)
        </footer>
      </div>
    </div>
  );
};

export default Layout;
