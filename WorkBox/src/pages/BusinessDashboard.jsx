import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProjectForm from './AddProjectForm';
import 'bootstrap/dist/css/bootstrap.min.css';

const BusinessDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchProjects = () => {
    fetch('http://localhost:8082/projects')
      .then(response => response.json())
      .then(data => {
        const projectList = data._embedded
          ? Object.values(data._embedded)[0]
          : [];
        setProjects(projectList);
      })
      .catch(err => console.error('Error fetching projects:', err));
  };

  const handleProjectAdded = () => {
    fetchProjects();
    setShowSuccessAlert(true);
    setShowModal(false);
    setTimeout(() => setShowSuccessAlert(false), 4000);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-primary">Business Dashboard</h1>

      {/* Statistics cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <h3>{projects.length}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-8 d-flex align-items-end justify-content-end">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add New Project
          </button>
          <button 
            className="btn btn-secondary ms-2" 
            onClick={() => navigate('/teams')}
          >
            Go to Teams
          </button>
        </div>
      </div>

      {/* Success alert */}
      {showSuccessAlert && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Success!</strong> Project has been successfully added.
          <button type="button" className="btn-close" onClick={() => setShowSuccessAlert(false)}></button>
        </div>
      )}

      {/* Project list */}
      <h3 className="mb-3">Project List</h3>
      {projects.length === 0 && <p>No projects found.</p>}

      <div className="row">
        {projects.map(proj => (
          <div key={proj.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-primary">{proj.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{proj.status}</h6>
                <p><strong>Project Manager:</strong> {proj.projectManager}</p>
                <p><strong>Client Contact:</strong> {proj.clientContact}</p>
                <p><strong>Published:</strong> {proj.publicationDate}</p>
                <p><strong>Start Date:</strong> {proj.startDate}</p>
                <p><strong>Takeover Date:</strong> {proj.takeoverDate || 'N/A'}</p>
                <p><strong>End Date:</strong> {proj.endDate || 'N/A'}</p>

                {proj.team && (
                  <>
                    <hr />
                    <p><strong>Team:</strong> {proj.team.name}</p>
                    <p><strong>Team Lead:</strong> {proj.team.teamLeader}</p>
                  </>
                )}

                {/* Manage Tasks button */}
                <div className="mt-auto">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => navigate(`/projects/${proj.id}/tasks`)}
                  >
                    Manage Tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for project form */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)} // close modal on outside click
        >
          <div
            className="modal-dialog modal-lg modal-dialog-scrollable"
            style={{ maxHeight: '90vh' }}
            onClick={e => e.stopPropagation()} // prevent close on modal content click
          >
            <div
              className="modal-content d-flex flex-column"
              style={{ height: '100%' }}
            >
              <div className="modal-header flex-shrink-0">
                <h5 className="modal-title">Add New Project</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div
                className="modal-body flex-grow-1 overflow-auto"
                style={{ maxHeight: 'calc(90vh - 150px)' }}
              >
                <AddProjectForm onProjectAdded={handleProjectAdded} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
