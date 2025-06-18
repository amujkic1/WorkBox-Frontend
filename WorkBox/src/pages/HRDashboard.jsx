import { useState, useEffect, use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AreaChart, DonutChart } from '../components/dashboard/Charts';
import OpeningForm from '../components/forms/OpeningForm';
import ApplicationList from '../components/dashboard/ApplicationList';
import DashboardCards from '../components/dashboard/DashboardCards';
import OpeningTable from '../components/dashboard/OpeningTable';
import Sidebar from '../components/common/Sidebar';
import { jwtDecode } from 'jwt-decode';

const HRDashboard = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [openings, setOpenings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showRequestAlert, setShowRequestAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestAlertMessage, setRequestAlertMessage] = useState('');
  const [topbarName, setTopbarName] = useState(''); 

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
      .catch(() => setErrorMessage('Error while fetching openings.'));
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
      .catch(() => setErrorMessage('Error while fetching applications.'));
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
        result: "Pending",
        userId: 1
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
      .catch((err) => setErrorMessage('Failed to create an opening.', err));
  };

  const fetchUserById = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/hr/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });

      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();
      return data.firstName + " " + data.lastName;
    } catch (err) {
      return "Nepoznat korisnik";
    }
  };

  const fetchRequestsWithUserNames = async () => {
  try {
    const response = await fetch('http://localhost:8080/hr/requests', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    if (!response.ok) throw new Error("Failed to fetch requests");

    const requestData = await response.json();

    console.log(requestData)

    const requestsWithNames = await Promise.all(
      requestData._embedded?.requestDTOList.map(async (req) => {
        const userName = req.userId ? await fetchUserById(req.userId) : "Anonymus";
        return { ...req, userName };
      })
    );

    setRequests(requestsWithNames);
  } catch (error) {
    setErrorMessage('Greška pri dohvaćanju zahtjeva.');
  }
};

  const updateRequestStatus = (id, status) => {
    const patchBody = [
      {
        op: "replace",
        path: "/status",
        value: status
      }
    ];

    fetch(`http://localhost:8080/hr/requests/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      credentials: 'include',
      body: JSON.stringify(patchBody)
    })
      .then(async response => {
        if (response.ok) {
          const result = await response.json();
          console.log("Request updated", result);

        setRequests(prev =>
          prev.filter(req => req.id !== id)
        );

        if (selectedRequest?.id === id) {
          setShowRequestModal(false);
          setSelectedRequest(null);
        }

        setRequestAlertMessage(`Request ${status.toLowerCase()}.`);
        setTimeout(() => setRequestAlertMessage(''), 4000);

        } else {
          console.log("Failed to update request");
          setErrorMessage('Failed to update request.');
        }
      })
      .catch(() => setErrorMessage('Failed to update request.'));
  };

  useEffect(() => {
    fetchOpenings();
    fetchApplications();
    fetchRequestsWithUserNames();

    const getTokenFromCookie = () => {
    const match = document.cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
  };

  const token = getTokenFromCookie();
  if (token) {
    try {
      const decoded = jwtDecode(token);
      setTopbarName(decoded.firstName || '');
    } catch (err) {
      console.error('Failed to decode token:', err);
    }
  }

  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3">
        <div className="container-fluid d-flex justify-content-end align-items-center">
          <span className="text-white me-3 fs-6">Welcome, <strong>{topbarName || 'User'}</strong></span>
         <button className="btn btn-outline-light btn-sm px-3">Logout</button>
        </div>
      </nav>

      <div className="container mt-4">

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold text-primary m-0">HR Dashboard</h2>
        </div>

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
        <OpeningTable openings={openings} onRefreshOpenings={fetchOpenings}/>

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
                  <ApplicationList
                    applications={applications}
                    onStatusChange={fetchApplications}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Zahtjevi zaposlenika */}
      <div className="card mb-4 shadow-lg">
      <div className="card-header bg-white">
        <h5 className="mb-0">Pending requests</h5>
      </div>
      <div className="card-body">
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <ul className="list-group">
          {requests.length === 0 ? (
            <li className="list-group-item text-muted">No requests.</li>
          ) : (
            requests
            .filter(req => req.status === "Pending")
            .map(req => (
              <li key={req.id} className="list-group-item d-flex justify-content-between align-items-center">
                {req.type} - {req.userName}
                <span>
                  <small className="text-muted me-2">{new Date(req.date).toLocaleDateString()}</small>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => {
                          setSelectedRequest(req);
                          setShowRequestModal(true);
                        }}>Details
                  </button>
                  <button
                    className="btn btn-sm btn-outline-success me-2"
                    title="Approve"
                    onClick={() => updateRequestStatus(req.id, "Approved")}
                  >
                    ✅
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger me-2"
                    title="Reject"
                    onClick={() => updateRequestStatus(req.id, "Rejected")}
                  >
                    ❌
                  </button>
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>

    {requestAlertMessage && (
      <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
        <strong>Success!</strong> {requestAlertMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setRequestAlertMessage('')}></button>
      </div>
    )}

    {showRequestModal && selectedRequest && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Request details</h5>
                <button type="button" className="btn-close" onClick={() => setShowRequestModal(false)}></button>
              </div>
              <div className="modal-body">
                <p><strong>Type:</strong> {selectedRequest.type}</p>
                <p><strong>Description:</strong> {selectedRequest.text}</p>
                <p><strong>Employee:</strong> {selectedRequest.userName}</p>
                <p><strong>Request made on:</strong> {new Date(selectedRequest.date).toLocaleString()}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    
    </>
  );
};

export default HRDashboard;