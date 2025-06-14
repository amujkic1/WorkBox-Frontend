import React from 'react';
import FinanceSidebar from './FinanceSidebar';
import { Routes, Route } from 'react-router-dom';
import EmployeeBenefits from './EmployeeBenefits';
import Payroll from './Payroll';
import FinanceReports from './FinanceReports';

function FinanceDashboard() {
  return (
    <div className="d-flex">
      <FinanceSidebar />

      <div className="container-fluid mt-4">
       <Routes>
          <Route path="/" element={
            <>
              <h1>Finance Dashboard</h1>
              <p>Dobrodošli u finansijski pregled!</p>
            </>
          }/>

          <Route path="benefits" element={<EmployeeBenefits />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path='reports' element={<FinanceReports />} />

          </Routes>
      </div>

    </div>
  );
}

export default FinanceDashboard;
