import React, { useState } from 'react';
import axios from 'axios'; // Importovanje axios-a

// Komponente za prikaz izvještaja
import TimesheetReport from '../components/finance/TimesheetReport';
import EmployeeStatusReport from '../components/finance/EmployeeStatusReport';

export default function FinanceReports() {
  const [selectedReport, setSelectedReport] = useState(''); // Odabrani izvještaj
  const [fromDate, setFromDate] = useState(''); // Datum početka
  const [toDate, setToDate] = useState(''); // Datum kraja
  const [reportData, setReportData] = useState(null); // Podaci za izvještaj
  const [errorMessage, setErrorMessage] = useState(''); // Poruka o grešci
  const [isCardCollapsed, setIsCardCollapsed] = useState(false); // Da li je kartica sužena?

  // Funkcija za generisanje izvještaja
  const generateReport = async () => {
    if (selectedReport === 'Timesheet Report') {
      if (!fromDate || !toDate) {
        setErrorMessage('You need to enter both dates!');
        return;
      }

      setErrorMessage('');
      try {
        const response = await axios.get(`http://localhost:8080/finance/timesheet_report`, {
          params: { fromDate, toDate }, // Parametri za URL
        });
        setReportData(response.data); // Postavljanje podataka za izvještaj
      } catch (error) {
        console.error('Error generating the report', error);
        setErrorMessage('An error occurred while loading the report.');
      }
    } 
    else if (selectedReport === 'Employee Status Report') {
      try {
        const response = await axios.get('http://localhost:8080/finance/test2');
        setReportData(response.data); // Postavljanje podataka za izvještaj
      } catch (error) {
        console.error('Error generating the report', error);
        setErrorMessage('An error occurred while loading the report.');
      }
    }
  };

  // Toggle funkcija za sužavanje/proširivanje kartice
  const toggleCardCollapse = () => {
    setIsCardCollapsed(prevState => !prevState);
  };

  return (
    <div className="container-fluid px-0">
      <h2 className="mb-3">Financial reports</h2>

      {/* Izbor tipa izvještaja i dugme */}
      <div className="card mb-4 border-1 border-gradient-dark rounded shadow-sm">

        <div className="card-body">
          {/* Gornji desni ugao sa strelicom za sužavanje */}
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

          {/* Sužavanje kartice */}
          {!isCardCollapsed && (
            <div>
              {/* Izbor tipa izvještaja */}
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

              {/* Polja za unos datuma (samo za Timesheet Report) */}
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

              {/* Prikaz poruke o grešci */}
              {errorMessage && <p className="text-danger">{errorMessage}</p>}

              {/* Dugme za generisanje izvještaja */}
              <div>
                <button
                  onClick={generateReport}
                  disabled={!selectedReport} // Dugme je onemogućeno dok se ne izabere tip izvještaja
                  className="btn btn-primary"
                >
                  Generate report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prikaz rezultata izvještaja */}
      {reportData && selectedReport === 'Timesheet Report' && (
        <TimesheetReport data={reportData} />
      )}

      {reportData && selectedReport === 'Employee Status Report' && (
        <EmployeeStatusReport data={reportData} />
      )}
    </div>
  );
}
