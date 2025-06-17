import React, { useState } from 'react';
import axios from 'axios';

const AddProjectForm = ({ onProjectAdded }) => {
  const [project, setProject] = useState({
    title: '',
    projectManager: '',
    clientContact: '',
    publicationDate: '',
    takeoverDate: '',
    startDate: '',
    endDate: '',
    status: '',
    teamName: '',
    teamLeader: '',
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setProject({
      title: '',
      projectManager: '',
      clientContact: '',
      publicationDate: '',
      takeoverDate: '',
      startDate: '',
      endDate: '',
      status: '',
      teamName: '',
      teamLeader: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Kreiraj tim
      const teamResponse = await axios.post('http://localhost:8082/teams', {
        name: project.teamName,
        teamLeader: project.teamLeader
      });

      const newTeamId = teamResponse.data.id || teamResponse.data.content?.id;
      if (!newTeamId) throw new Error('Nema ID-a u odgovoru od /teams');

      // 2. Kreiraj projekat
      const projectPayload = {
        title: project.title,
        projectManager: project.projectManager,
        clientContact: project.clientContact,
        publicationDate: project.publicationDate,
        takeoverDate: project.takeoverDate,
        startDate: project.startDate,
        endDate: project.endDate,
        status: project.status,
        team: { id: newTeamId }
      };

      await axios.post('http://localhost:8082/projects', projectPayload);

      if (onProjectAdded) onProjectAdded();

      resetForm(); // očisti formu
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Greška pri dodavanju projekta ili tima');
    } finally {
      setLoading(false);
    }
  };

  const fieldLabels = {
    title: 'Project Title',
    projectManager: 'Project Manager',
    clientContact: 'Client Contact',
    publicationDate: 'Publication Date',
    takeoverDate: 'Takeover Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    status: 'Status',
    teamName: 'Team Name',
    teamLeader: 'Team Leader'
  };

  return (
    <div className="card p-4 shadow rounded">
      <h2 className="mb-4">Add New Project</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        {/* Tekstualna polja */}
        {['title', 'projectManager', 'clientContact'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{fieldLabels[field]}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={project[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Datumi */}
        {['publicationDate', 'takeoverDate', 'startDate', 'endDate'].map((dateField) => (
          <div className="mb-3" key={dateField}>
            <label className="form-label">{fieldLabels[dateField]}</label>
            <input
              type="date"
              className="form-control"
              name={dateField}
              value={project[dateField]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">{fieldLabels.status}</label>
          <select
            className="form-select"
            name="status"
            value={project.status}
            onChange={handleChange}
            required
          >
            <option value="">Select status</option>
            <option value="Active">Active</option>
            <option value="In Progress">In Progress</option>
            <option value="Finished">Finished</option>
          </select>
        </div>

        {/* Tim */}
        <h5 className="mt-4">New Team Info</h5>
        {['teamName', 'teamLeader'].map((field) => (
          <div className="mb-3" key={field}>
            <label className="form-label">{fieldLabels[field]}</label>
            <input
              type="text"
              className="form-control"
              name={field}
              value={project[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Saving...
            </>
          ) : (
            'Add Project'
          )}
        </button>
      </form>
    </div>
  );
};

export default AddProjectForm;
