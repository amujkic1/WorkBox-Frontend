import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Komponente za prikaz izvještaja
import TimesheetReport from '../components/finance/TimesheetReport';
import EmployeeStatusReport from '../components/finance/EmployeeStatusReport';

export default function FinanceReports() {
  const [selectedReport, setSelectedReport] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [timesheetData, setTimesheetData] = useState(null);
  const [employeeStatusData, setEmployeeStatusData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);

  // Reset podataka kada se promijeni tip izvještaja
  useEffect(() => {
    setTimesheetData(null);
    setEmployeeStatusData(null);
    setErrorMessage('');
  }, [selectedReport]);

  const generateReport = async () => {
    if (selectedReport === 'Timesheet Report') {
      if (!fromDate || !toDate) {
        setErrorMessage('You need to enter both dates!');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/finance/timesheet_report', {
          params: { fromDate, toDate },
        });
        setTimesheetData(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error generating the Timesheet Report:', error);
        setErrorMessage('An error occurred while loading the Timesheet Report.');
      }
    } else if (selectedReport === 'Employee Status Report') {
      try {
        const response = await axios.get('http://localhost:8080/finance/employee_status_report');
        setEmployeeStatusData(response.data);
        setErrorMessage('');
      } catch (error) {
        console.error('Error generating the Employee Status Report:', error);
        setErrorMessage('An error occurred while loading the Employee Status Report.');
      }
    }
  };

  const toggleCardCollapse = () => {
    setIsCardCollapsed(prev => !prev);
  };

  return (
    <div className="container-fluid px-0">
      <h2 className="mb-3">Financial reports</h2>

      <div className="card mb-4 border-1 border-gradient-dark rounded shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <label htmlFor="reportType" className="form-label">Select report type:</label>
            <button
              className="btn btn-link"
              onClick={toggleCardCollapse}
              aria-expanded={!isCardCollapsed}
            >
              <i className={`fas ${isCardCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
            </button>
          </div>

          {!isCardCollapsed && (
            <div>
              <div className="mb-3">
                <select
                  id="reportType"
                  value={selectedReport}
                  onChange={(e) => setSelectedReport(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select type</option>
                  <option value="Timesheet Report">Timesheet report</option>
                  <option value="Employee Status Report">Employee status report</option>
                </select>
              </div>

              {selectedReport === 'Timesheet Report' && (
                <>
                  <div className="mb-3">
                    <label htmlFor="fromDate" className="form-label">From date:</label>
                    <input
                      type="date"
                      id="fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="form-control"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="toDate" className="form-label">To date:</label>
                    <input
                      type="date"
                      id="toDate"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="form-control"
                    />
                  </div>
                </>
              )}

              {errorMessage && <p className="text-danger">{errorMessage}</p>}

              <button
                onClick={generateReport}
                disabled={!selectedReport}
                className="btn btn-primary"
              >
                Generate report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Prikaz izvještaja */}
      {selectedReport === 'Timesheet Report' && timesheetData && (
        <TimesheetReport data={timesheetData} />
      )}

      {selectedReport === 'Employee Status Report' && employeeStatusData && (
        <EmployeeStatusReport data={employeeStatusData} />
      )}
    </div>
  );
}
