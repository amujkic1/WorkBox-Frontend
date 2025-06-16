import React, { useState } from 'react';

const AddProjectForm = () => {
  const [teamName, setTeamName] = useState('');
  const [teamLeader, setTeamLeader] = useState('');
  const [projectData, setProjectData] = useState({
    title: '',
    projectManager: '',
    clientContact: '',
    status: '',
    publicationDate: '',
    takeoverDate: '',
    startDate: '',
    endDate: ''
  });

  const handleChange = e => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleTeamSubmit = async () => {
    const response = await fetch('http://localhost:8082/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: teamName,
        teamLeader: teamLeader
      })
    });

    if (!response.ok) {
      alert("Greška pri kreiranju tima.");
      return null;
    }

    const data = await response.json();
    return data.id; // Pretpostavlja se da backend vraća `id` direktno
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    const teamId = await handleTeamSubmit();
    if (!teamId) return;

    const finalProjectData = {
      ...projectData,
      team: { id: teamId }
    };

    const response = await fetch('http://localhost:8082/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(finalProjectData)
    });

    if (response.ok) {
      alert("Projekat uspješno prijavljen!");
    } else {
      alert("Greška pri prijavi projekta.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Prijava novog projekta</h2>
      <form onSubmit={handleProjectSubmit}>
        <h4 className="mt-4">Informacije o timu</h4>
        <div className="mb-3">
          <label className="form-label">Naziv tima</label>
          <input type="text" className="form-control" value={teamName} onChange={e => setTeamName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Vođa tima</label>
          <input type="text" className="form-control" value={teamLeader} onChange={e => setTeamLeader(e.target.value)} required />
        </div>

        <h4 className="mt-4">Informacije o projektu</h4>
        <div className="mb-3">
          <label className="form-label">Naslov</label>
          <input type="text" className="form-control" name="title" value={projectData.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Voditelj projekta</label>
          <input type="text" className="form-control" name="projectManager" value={projectData.projectManager} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Kontakt klijenta (email)</label>
          <input type="email" className="form-control" name="clientContact" value={projectData.clientContact} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <input type="text" className="form-control" name="status" value={projectData.status} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Datum objave</label>
          <input type="date" className="form-control" name="publicationDate" value={projectData.publicationDate} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Datum preuzimanja</label>
          <input type="date" className="form-control" name="takeoverDate" value={projectData.takeoverDate} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Datum početka</label>
          <input type="date" className="form-control" name="startDate" value={projectData.startDate} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Datum završetka</label>
          <input type="date" className="form-control" name="endDate" value={projectData.endDate} onChange={handleChange} />
        </div>

        <button type="submit" className="btn btn-primary">Prijavi projekat</button>
      </form>
    </div>
  );
};

export default AddProjectForm;
