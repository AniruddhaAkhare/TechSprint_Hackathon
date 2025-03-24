// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // CSS file for styling

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src="/img/fireblaze.jpg" alt="Fireblaze Logo" className="logo-img" />
          <span>Fireblaze</span>
        </Link>

        {/* Navigation Links (Optional) */}
        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/institute-setup" className="nav-link">Institute Setup</Link>
          {/* Add more links as needed */}
        </nav>

        {/* User Profile / Actions */}
        <div className="header-actions">
          <span className="user-initials">AD</span>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;