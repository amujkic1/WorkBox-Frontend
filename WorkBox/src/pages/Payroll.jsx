import React, { useState } from 'react';

export default function Payroll() {
  const [mode, setMode] = useState('all');
  const [employeeId, setEmployeeId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);

  const toggleCardCollapse = () => {
    setIsCardCollapsed(prev => !prev);
  };

  const handlePayroll = () => {
    setErrorMessage('');

    if (!fromDate || !toDate) {
      setErrorMessage('Molimo unesite oba datuma.');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setErrorMessage('Datum "Od" ne može biti nakon datuma "Do".');
      return;
    }

    if (mode === 'single' && !employeeId.trim()) {
      setErrorMessage('Unesite ID uposlenika.');
      return;
    }

    if (mode === 'single') {
      console.log(`Obračun plate za uposlenika ID: ${employeeId}, period: ${fromDate} - ${toDate}`);
    } else {
      console.log(`Obračun plata za sve uposlenike, period: ${fromDate} - ${toDate}`);
    }

    alert('Obračun pokrenut (simulacija).');
  };

  return (
    <div className="container-fluid px-0">
      <h2 className="mb-3">Obračun plata</h2>

      <div className="card mb-4 border-1 border-gradient-dark rounded shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label mb-0">Način obračuna:</label>
            <button
              className="btn btn-link"
              onClick={toggleCardCollapse}
              aria-expanded={!isCardCollapsed}
            >
              <i className={`fas ${isCardCollapsed ? 'fa-chevron-down' : 'fa-chevron-up'}`} />
            </button>
          </div>

          {!isCardCollapsed && (
            <>
              {/* Padajuća lista za izbor */}
              <div className="mb-3">
                <label htmlFor="modeSelect" className="form-label">Odaberite tip obračuna:</label>
                <select
                  id="modeSelect"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="form-select"
                >
                  <option value="all">Svi uposlenici</option>
                  <option value="single">Jedan uposlenik</option>
                </select>
              </div>

              {/* ID uposlenika ako je odabrano 'single' */}
              {mode === 'single' && (
                <div className="mb-3">
                  <label htmlFor="employeeId" className="form-label">ID uposlenika:</label>
                  <input
                    type="text"
                    id="employeeId"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="form-control"
                    placeholder="npr. 12345"
                  />
                </div>
              )}

              {/* Vremenski raspon */}
              <div className="mb-3">
                <label htmlFor="fromDate" className="form-label">Od datuma:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="toDate" className="form-label">Do datuma:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-control"
                />
              </div>

              {/* Poruka o grešci */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {/* Dugme za obračun */}
              <button
                onClick={handlePayroll}
                className="btn btn-primary w-100"
              >
                Obračunaj platu
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
