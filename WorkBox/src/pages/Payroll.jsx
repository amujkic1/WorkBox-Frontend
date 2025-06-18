import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importujemo cookies

export default function Payroll() {
  const [mode, setMode] = useState('all');
  const [employeeId, setEmployeeId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [results, setResults] = useState(null);  // Stanje za rezultate
  const [isLoading, setIsLoading] = useState(false); // Stanje za loading

  const toggleCardCollapse = () => {
    setIsCardCollapsed(prev => !prev);
  };

  const handlePayroll = async () => {
    setErrorMessage('');
    setResults(null);  // Resetujemo rezultate svaki put kada pokrenemo obračun
    setIsLoading(true); // Pokrećemo loading indikator

    if (!fromDate || !toDate) {
      setErrorMessage('Molimo unesite oba datuma.');
      setIsLoading(false);
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setErrorMessage('Datum "Od" ne može biti nakon datuma "Do".');
      setIsLoading(false);
      return;
    }

    if (mode === 'single' && !employeeId.trim()) {
      setErrorMessage('Unesite ID uposlenika.');
      setIsLoading(false);
      return;
    }

    // Dohvatanje JWT tokena iz cookie-ja (provereno da je postavljen u Login komponenti kao 'token')
    const jwtToken = Cookies.get('token'); // Promenili smo ključ na 'token'

    if (!jwtToken) {
      setErrorMessage('Nema validnog JWT tokena.');
      setIsLoading(false);
      return;
    }

    try {
      // Kreiramo URL sa parametrima
      const url = `http://localhost:8080/finance/employees_payroll?fromDate=${fromDate}&toDate=${toDate}${mode === 'single' ? `&employeeId=${employeeId}` : ''}`;

      // API poziv sa axios-om
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${jwtToken}` // Dodajemo JWT token u Authorization header
        }
      });

      // Ako je uspešan odgovor, postavljamo rezultate
      setResults(response.data);
    } catch (error) {
      setErrorMessage(error.response ? error.response.data.message : 'Došlo je do greške prilikom poziva API-ja');
    } finally {
      setIsLoading(false);  // Završavamo loading
    }
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
                disabled={isLoading}  // Onemogućavamo dugme dok traje poziv
              >
                {isLoading ? 'Učitavanje...' : 'Obračunaj platu'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Prikaz rezultata kao JSON */}
      {results && (
        <div className="mt-4">
          <h4>Rezultati:</h4>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
