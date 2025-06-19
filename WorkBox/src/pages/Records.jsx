import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Records = () => {
  const [records, setRecords] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [topbarName, setTopbarName] = useState(''); 
  const [users, setUsers] = useState([]);
  const [benefits, setBenefits] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 6;
  const navigate = useNavigate();

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

    const fetchUsers = () => {
        fetch('http://localhost:8080/hr/users', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        })
            .then(async (response) => {
            if (response.ok) {
                const data = await response.json();
                const userList = data._embedded?.userDTOList || [];
                setUsers(userList);
            }
            })
            .catch(() => console.error('Failed to fetch users.'));
    }

    const filterRecords = (status='') => {
        setCurrentPage(1);
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

  const updateRecord = async () => {
  try {
    const response = await fetch(`http://localhost:8080/hr/records/${selectedRecord.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        status: selectedRecord.status,
        workingHours: selectedRecord.workingHours,
      }),
    });

    if (response.ok) {
      setShowEditModal(false);
      setShowSuccessAlert(true);
      fetchRecords(); 
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } else {
      const errData = await response.json();
      console.error('Failed to update:', errData);
      setErrorMessage('Failed to update record.');
    }
  } catch (error) {
    console.error('Update error:', error);
    setErrorMessage('An error occurred during update.');
  }
};

const handleLogout = async () => {
    try {
     const token = Cookies.get('token');
     if (!token) {
       throw new Error('Token not found');
     }

     const payload = JSON.parse(atob(token.split('.')[1]));
     const uuid = payload.uuid;
     console.log("UUID usera koji se ažurira:",uuid);

     const patch = [
       { op: "replace", path: "/checkOutTime", value: new Date().toTimeString().split(' ')[0] }
     ];
     console.log("Ažurira se vrijeme u:",patch);

     await axios.patch(`http://localhost:8080/finance/check_in_record/${uuid}`, patch, {
       headers: {
         'Content-Type': 'application/json-patch+json',
         Authorization: `Bearer ${token}`
       }
     });

    } catch (error) {
      console.log('Failed to update checkOutTime:', error.message);
    }

    Cookies.remove('token');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
   
    navigate('/');
  }


  useEffect(() => {
    fetchRecords();
    fetchUsers();

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

  useEffect(() => {
  const fetchBenefitsForUsers = async () => {
    const newBenefits = {};

    for (const user of users) {
      try {
        const res = await fetch(`http://localhost:8080/hr/employee_benefit/user/${user.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.ok) {
          const benefitData = await res.json();
          newBenefits[user.uuid] = benefitData || 'No benefits';
        }
      } catch (err) {
        console.error('Error fetching benefits for user', user.id, err);
        newBenefits[user.uuid] = 'Error';
      }
    }

    setBenefits(newBenefits);
  };

  if (users.length > 0) {
    fetchBenefitsForUsers();
  }
}, [users]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm py-3">
        <div className="container-fluid d-flex justify-content-end align-items-center">
             <span className="text-white me-3 fs-6">Welcome, <strong>{topbarName || 'User'}</strong></span>
            <button onClick={handleLogout} className="btn btn-outline-light btn-sm px-3">Logout</button>
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
            <th>Benefits</th>
            </tr>
        </thead>
        <tbody>
            {currentRecords.map((record) => (
            <tr key={record.id}>
                <td>
                <div className="d-flex align-items-center">
                    <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                    />
                    <div className="ms-3">
                    <p className="fw-bold mb-1">
                      {(() => {
                        const matchedUser = users.find(user => user.uuid === record.userUuid);
                        return matchedUser ? `${matchedUser.firstName} ${matchedUser.lastName}` : `User #${record.id}`;
                      })()}
                    </p>
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
                <td>
                  {benefits[record.userUuid] && benefits[record.userUuid].length > 0
                    ? benefits[record.userUuid][0].type === 'zdravstvo'
                      ? 'Healthcare'
                      : benefits[record.userUuid][0].type
                    : 'No data'}
                </td>
            </tr>
            ))}
        </tbody>
        </table>

        <nav className='mt-3'>
  <ul className="pagination justify-content-center">
    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
    </li>

    {Array.from({ length: Math.ceil(records.length / recordsPerPage) }, (_, i) => i + 1).map(pageNumber => (
      <li
        key={pageNumber}
        className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}
      >
        <button className="page-link" onClick={() => setCurrentPage(pageNumber)}>
          {pageNumber}
        </button>
      </li>
    ))}

    <li className={`page-item ${currentPage === Math.ceil(records.length / recordsPerPage) ? 'disabled' : ''}`}>
      <button
        className="page-link"
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === Math.ceil(records.length / recordsPerPage)}
      >
        Next
      </button>
    </li>
  </ul>
</nav>


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
                    updateRecord();
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
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="ANNUAL_LEAVE">Annual Leave</option>
                        <option value="SICK_LEAVE">Sick Leave</option>
                    </select>
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
            <strong>Success!</strong> Record has been successfully updated.
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