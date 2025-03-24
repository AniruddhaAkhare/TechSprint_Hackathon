// src/components/Layout.js
import React from 'react';
import Header from '../pages/home/Header.jsx';
import Sidebar from '../pages/home/Sidebar'; // Assuming you have this from earlier
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <div className="layout-container">
        <Sidebar />
        <main className="layout-content">
          {children} {/* This will render the page-specific content */}
        </main>
      </div>
    </div>
  );
};

export default Layout;