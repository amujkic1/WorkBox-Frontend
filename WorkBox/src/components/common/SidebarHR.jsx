import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarHR() {
  const location = useLocation();

  return (
    <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
      <Link className="sidebar-brand d-flex align-items-center justify-content-center" to="/hr">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-box-open"></i>
        </div>
        <div className="sidebar-brand-text mx-3">WorkBox</div>
      </Link>

      <hr className="sidebar-divider my-0" />

      <li className={`nav-item ${location.pathname === '/hr' ? 'active' : ''}`}>
        <Link className="nav-link" to="/hr">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </Link>
      </li>

      <li className={`nav-item ${location.pathname === '/records' ? 'active' : ''}`}>
        <Link className="nav-link" to="/records">
          <i className="fas fa-fw fa-users"></i>
          <span>Employee Records</span>
        </Link>
      </li>

      <hr className="sidebar-divider d-none d-md-block" />
    </ul>
  );
}