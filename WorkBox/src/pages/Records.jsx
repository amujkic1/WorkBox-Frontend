import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [topbarName, setTopbarName] = useState(''); 

  const fetchRecords = () => {
    fetch('http://localhost:8080/hr/records', {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
    })
        .then(async response => {
        if (response.ok) {
            const data = await response.json();
            setRecords(data._embedded?.recordDTOList || []);
            setErrorMessage("");
        }
        })
        .catch(() => setErrorMessage('An error occurred while fetching records.'));
    };

    const filterRecords = (status='') => {
        let url = 'http://localhost:8080/hr/records_by_status';
        if (status) {
            url += `?status=${encodeURIComponent(status)}`;
        }

        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        })
            .then(async response => {
            if (response.ok) {
                const data = await response.json();
                setRecords(data._embedded?.recordDTOList || []);
                setErrorMessage("");
            }
            })
            .catch(() => setErrorMessage('An error occurred while fetching records.'));
    };

    const handleEditClick = (record) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    };

  useEffect(() => {
    fetchRecords();

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
            <h2 className="fw-bold text-primary m-0">Employee Records</h2>
            <div className="d-flex align-items-center gap-3">
            <label className="form-label m-0">Filter by status:</label>
            <select
                className="form-select"
                style={{ width: "200px" }}
                value={statusFilter}
                onChange={(e) => {
                const selected = e.target.value;
                setStatusFilter(selected);
                filterRecords(selected); 
                }}
            >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="ANNUAL_LEAVE">Annual leave</option>
                <option value="SICK_LEAVE">Sick leave</option>
            </select>
            </div>

        </div>

        <table className="table table-hover align-middle mb-0 bg-white shadow rounded overflow-hidden">
        <thead className="bg-light">
            <tr>
            <th>Name</th>
            <th></th>
            <th>Status</th>
            <th>Position</th>
            </tr>
        </thead>
        <tbody>
            {records.map((record) => (
            <tr key={record.id}>
                <td>
                <div className="d-flex align-items-center">
                    <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                    />
                    <div className="ms-3">
                    <p className="fw-bold mb-1">User #{record.id}</p>
                    </div>
                </div>
                </td>
                <td>
                <p className="fw-normal mb-1">
                    Working Hours: {record.workingHours}
                </p>
                <p className="text-muted mb-0">
                    Employed on: {new Date(record.employmentDate).toLocaleDateString()}
                </p>
                </td>
                <td>

                <span
                className={`badge rounded-pill d-inline ${
                    record.status === "ACTIVE"
                    ? "bg-success"
                    : record.status === "INACTIVE"
                    ? "bg-secondary"
                    : record.status === "ANNUAL_LEAVE"
                    ? "bg-info text-dark"
                    : record.status === "SICK_LEAVE"
                    ? "bg-warning text-dark"
                    : "bg-light text-dark"
                }`}
                >
                {record.status.replace('_', ' ')}
                </span>

                <button
                    type="button"
                    className="btn btn-link btn-sm btn-rounded"
                    onClick={() => handleEditClick(record)}
                    >
                    ✏️
                    </button>
                </td>
                <td>{record.workingHours >= 8 ? "Senior" : "Junior"}</td>
                
            </tr>
            ))}
        </tbody>
        </table>

        {showEditModal && selectedRecord && (
        <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Edit Record #{selectedRecord.id}</h5>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                ></button>
                </div>
                <div className="modal-body">
                <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    // Ovdje ide API poziv za update ako želiš
                    setShowEditModal(false);
                    setShowSuccessAlert(true);
                    setTimeout(() => setShowSuccessAlert(false), 3000);
                    }}
                >
                    <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                        className="form-select"
                        value={selectedRecord.status}
                        onChange={(e) =>
                        setSelectedRecord({ ...selectedRecord, status: e.target.value })
                        }
                    >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Pending</option>
                    </select>
                    </div>
                    <div className="mb-3">
                    <label className="form-label">Working Hours</label>
                    <input
                        type="number"
                        className="form-control"
                        value={selectedRecord.workingHours}
                        onChange={(e) =>
                        setSelectedRecord({ ...selectedRecord, workingHours: e.target.value })
                        }
                    />
                    </div>
                    <div className="text-end">
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>
        </div>
        )}


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

      </div>
    
    </>
  );
};

export default Records;