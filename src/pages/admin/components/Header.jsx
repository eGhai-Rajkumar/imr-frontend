import React from 'react';
import { Menu, LogOut, User, Bell, Search } from 'lucide-react';
import '../css/Header.css';

export default function Header({ isSidebarOpen, toggleSidebar, onLogout }) {
  return (
    <header className="admin-header">
      <div className="header-container">
        {/* Toggle Button - ALWAYS VISIBLE (Desktop & Mobile) */}
        <button 
          className="header-toggle-btn" 
          onClick={toggleSidebar}
          aria-label="Toggle menu"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <Menu size={22} />
        </button>

        {/* Search Bar */}
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search trips, hotels, leads..." 
            className="search-input"
          />
        </div>

        {/* Right Side Actions */}
        <div className="header-right">
          {/* Notifications */}
          <button className="header-icon-btn" title="Notifications">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          {/* User Profile */}
          <div className="user-profile">
            <div className="user-avatar">
              <User size={18} />
            </div>
            <span className="user-name">Admin</span>
          </div>
          
          {/* Logout Button */}
          <button 
            className="logout-button" 
            onClick={onLogout}
            title="Logout"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}