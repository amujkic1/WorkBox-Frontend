import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AreaChart, BarChart, DonutChart } from '../components/dashboard/Charts';
import OpeningForm from '../components/forms/OpeningForm';
import ApplicationList from '../components/dashboard/ApplicationList';

const HRDashboard = () => {

  const [showModal, setShowModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [openings, setOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleOpenForm = () => setShowModal(true);
  const handleCloseForm = () => setShowModal(false);

  const handleOpenAppForm = () => setShowAppModal(true);
  const handleCloseAppForm = () => setShowAppModal(false);

  const handleFormSubmit = (data) => {
    console.log("Podaci iz forme:", data);
    handleCloseForm();
  };

  const fetchOpenings = () => {
      fetch('http://localhost:8080/hr/openings', {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include"
      })
      .then(async response => {
        if(response.ok){
            const data = await response.json()
            setOpenings(data._embedded?.openingDTOList || []);  
        }
      }).catch(err => {
              console.error('Error with fetching openings: ', err)
              setErrorMessage('An error occurred. Try again.');
          })
  }

    const fetchApplications = () => {
      fetch('http://localhost:8080/hr/applications', {
          method: "GET",
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include"
      })
      .then(async response => {
        if(response.ok){
            const data = await response.json()
            setApplications(data._embedded?.applicationDTOList || []);  
        }
      }).catch(err => {
              console.error('Error with fetching openings: ', err)
              setErrorMessage('An error occurred. Try again.');
          })
  }

  useEffect(() => {
    fetchOpenings();
    fetchApplications();
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"></a>
          <div className="d-flex">
            <span className="navbar-text me-3">Dobrodošli, HR Zaposlenik</span>
            <button className="btn btn-outline-light">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card shadow-lg text-center"
                  onClick={handleOpenForm}
                  style={{cursor:'pointer'}}>
              <div className="card-body">
                <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>📂</div>
                <h5>Aktivni konkursi</h5>
                <h3>5</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg text-center"
                  onClick={handleOpenAppForm}
                  style={{cursor:'pointer'}}>
              <div className="card-body">
                <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>📥</div>
                <h5>Prijave u obradi</h5>
                <h3>12</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg text-center">
              <div className="card-body">
                <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>🗂️</div>
                <h5>Zahtjevi na čekanju</h5>
                <h3>8</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-lg text-center">
              <div className="card-body">
                <div className="card-icon mb-2" style={{ fontSize: '2rem', color: '#0d6efd' }}>👨‍💼</div>
                <h5>Zaposlenika ukupno</h5>
                <h3>73</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Modal za kreiranje konkursa */}
        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Dodaj novi konkurs</h5>
                  <button type="button" className="btn-close" onClick={handleCloseForm}></button>
                </div>
                <div className="modal-body">
                  <OpeningForm onSubmit={handleFormSubmit} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grafikoni */}
        <div className="row">
        <div className="col-xl-8 col-lg-7">
            <AreaChart />
        </div>
        <div className="col-xl-4 col-lg-5">
            <DonutChart />
        </div>
        </div>

        {/* Konkursi */}
        <div className="card mb-4 shadow-lg">
          <div className="card-header bg-white">
            <h5 className="mb-0">Aktivni konkursi</h5>
          </div>
          <div className="card-body">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Naziv</th>
                  <th>Datum otvaranja</th>
                  <th>Datum zatvaranja</th>
                  <th>Prijave</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {openings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">Nema dostupnih konkursa.</td>
                  </tr>
                ) : (
                  openings.map((opening, index) => (
                    <tr key={index}>
                      <td>{opening.openingName}</td>
                      <td>{opening.startDate}</td>
                      <td>{opening.endDate}</td>
                      <td>{opening.applicationCount ?? 0}</td>
                      <td>
                        <span className={`badge ${opening.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                          {opening.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">Pregled</button>
                        <button className="btn btn-sm btn-danger">Zatvori</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>

        {/* Modal za pregled prijava*/}
        {showAppModal && (
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={handleCloseAppForm}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Applications</h5>
                  <button type="button" className="btn-close" onClick={handleCloseAppForm}></button>
                </div>
                <div className="modal-body">
                  <ApplicationList applications={applications} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zahtjevi zaposlenika */}
        <div className="card mb-4 shadow-lg">
          <div className="card-header bg-white">
            <h5 className="mb-0">Zahtjevi zaposlenika</h5>
          </div>
          <div className="card-body">
            <ul className="list-group">
              <li className="list-group-item d-flex justify-content-between align-items-center">
                Promjena adrese - Elma H.
                <span>
                  <small className="text-muted me-2">2025-06-02</small>
                  <button className="btn btn-sm btn-outline-secondary">Detalji</button>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default HRDashboard;