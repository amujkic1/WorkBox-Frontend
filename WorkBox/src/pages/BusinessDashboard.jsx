import React, { useEffect, useState } from 'react';
import AddProjectForm from './AddProjectForm';

const BusinessDashboard = () => {
  const [projects, setProjects] = useState([]);

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

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Business Dashboard</h1>
      
      <AddProjectForm onProjectAdded={fetchProjects} />

      {projects.length === 0 && <p>No projects found</p>}
      <div className="row">
        {projects.map(proj => (
          <div key={proj.id} className="col-md-6 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{proj.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{proj.status}</h6>
                <p className="card-text"><strong>Project Manager:</strong> {proj.projectManager}</p>
                <p className="card-text"><strong>Client Contact:</strong> {proj.clientContact}</p>
                <p className="card-text"><strong>Publication Date:</strong> {proj.publicationDate}</p>
                <p className="card-text"><strong>Start Date:</strong> {proj.startDate}</p>
                <p className="card-text"><strong>Takeover Date:</strong> {proj.takeoverDate ?? 'N/A'}</p>
                <p className="card-text"><strong>End Date:</strong> {proj.endDate ?? 'N/A'}</p>
                {proj.team && (
                  <>
                    <hr />
                    <h6>Team Info</h6>
                    <p className="mb-1"><strong>Name:</strong> {proj.team.name}</p>
                    <p className="mb-0"><strong>Team Leader:</strong> {proj.team.teamLeader}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessDashboard;
