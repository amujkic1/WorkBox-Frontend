import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AreaChart, DonutChart } from '../components/dashboard/Charts';
import OpeningForm from '../components/forms/OpeningForm';
import ApplicationList from '../components/dashboard/ApplicationList';
import DashboardCards from '../components/dashboard/DashboardCards';
import OpeningTable from '../components/dashboard/OpeningTable';
import Sidebar from '../components/common/Sidebar';

const HRDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [openings, setOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchOpenings = () => {
    fetch('http://localhost:8080/hr/openings', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setOpenings(data._embedded?.openingDTOList || []);
        }
      })
      .catch(() => setErrorMessage('Greška pri dohvatu konkursa.'));
  };

  const fetchApplications = () => {
    fetch('http://localhost:8080/hr/applications', {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
      .then(async response => {
        if (response.ok) {
          const data = await response.json();
          setApplications(data._embedded?.applicationDTOList || []);
        }
      })
      .catch(() => setErrorMessage('Greška pri dohvatu prijava.'));
  };

const handleCreateOpening = (data) => {
  fetch('http://localhost:8080/hr/openings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      openingName: data.title,
      description: data.description,
      conditions: data.conditions.map(c => c.value).join(", "),
      benefits: data.benefits.map(b => b.value).join(", "), 
      startDate: data.startDate,
      endDate: data.endDate,
      //user ce inace biti hr koji kreira konkurs, implementirati poslije logina
      //userId: 1
    })
  })
    .then(async response => {
      if (response.ok) {
        const result = await response.json();
        setShowModal(false); 
        fetchOpenings();     
        setShowSuccessAlert(true); 
        setTimeout(() => setShowSuccessAlert(false), 4000);
      } else {
        setErrorMessage("Failed to create an opening.");
        setTimeout(() => setErrorMessage(''), 4000);
        setShowModal(false); 
      }
    })
    .catch(() => setErrorMessage('Failed to create an opening.'));
};


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
            <span className="navbar-text me-3">Welcome, HR Zaposlenik</span>
            <button className="btn btn-outline-light">Logout</button>
          </div>
        </div>
      </nav>

      <div className="container mt-4">



        {showSuccessAlert && (
          <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
            <strong>Success!</strong> Opening has been successfully created.
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setShowSuccessAlert(false)}></button>
          </div>
        )}

        {errorMessage && (
          <div className="alert alert-danger alert-dismissible fade show mt-3" role="alert">
            <strong>Error!</strong> {errorMessage}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setErrorMessage('')}></button>
          </div>
        )}


        <DashboardCards onOpenForm={() => setShowModal(true)} onOpenAppForm={() => setShowAppModal(true)} />
        <div className="row">
          <div className="col-xl-8 col-lg-7"><AreaChart /></div>
          <div className="col-xl-4 col-lg-5"><DonutChart /></div>
        </div>
        <OpeningTable openings={openings} />

        {showModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Create an opening</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <OpeningForm onSubmit={handleCreateOpening} />
                </div>
              </div>
            </div>
          </div>
        )}

        {showAppModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Applications</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAppModal(false)}></button>
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