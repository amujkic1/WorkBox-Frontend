import React from 'react';
import DashboardCards from '../components/DashboardCards';

export default function Dashboard() {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-4 text-gray-800">Dashboard</h1>
      <DashboardCards />
      <DashboardCards />
      
    </div>
  );
}
