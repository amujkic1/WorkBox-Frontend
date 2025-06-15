import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddBenefitsForm = ({ onClose }) => {
  const [users, setUsers] = useState([]);
  const [benefits, setBenefits] = useState([
    { type: '', status: '', details: '', userId: '' }
  ]);

  useEffect(() => {
    axios.get('http://localhost:8080/finance/users')
      .then(res => {
        const usersData = res.data._embedded ? Object.values(res.data._embedded)[0] : [];
        setUsers(usersData);
      })
      .catch(() => alert('Greška prilikom učitavanja korisnika.'));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...benefits];
    updated[index][field] = value;
    setBenefits(updated);
  };

  const addBenefit = () => {
    setBenefits([...benefits, { type: '', status: '', details: '', userId: '' }]);
  };

  const removeBenefit = (index) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const payload = benefits.map(b => ({
      type: b.type,
      status: b.status,
      details: b.details,
      user: { userId: parseInt(b.userId, 10) }
    }));

    try {
      await axios.post('http://localhost:8080/finance/employee_benefits', payload);
      alert('Benefiti su uspješno dodani.');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Greška prilikom spremanja benefita.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white', padding: '2rem', borderRadius: '8px',
        width: '90%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto'
      }}>
        <div className="mb-3">
          <h3>Dodaj nove benefite</h3>
        </div>

        {benefits.map((benefit, idx) => (
          <div key={idx} className="mb-3 border-bottom pb-3">
            <div className="form-group mb-2">
              <label>Zaposlenik</label>
              <select
                className="form-control"
                value={benefit.userId}
                onChange={e => handleChange(idx, 'userId', e.target.value)}
              >
                <option value="">Odaberi...</option>
                {users.map(user => (
                  <option key={user.userId} value={user.userId}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-2">
              <label>Tip</label>
              <input
                className="form-control"
                value={benefit.type}
                onChange={e => handleChange(idx, 'type', e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Status</label>
              <input
                className="form-control"
                value={benefit.status}
                onChange={e => handleChange(idx, 'status', e.target.value)}
              />
            </div>
            <div className="form-group mb-2">
              <label>Detalji</label>
              <input
                className="form-control"
                value={benefit.details}
                onChange={e => handleChange(idx, 'details', e.target.value)}
              />
            </div>
            {benefits.length > 1 && (
              <button className="btn btn-danger mt-2" onClick={() => removeBenefit(idx)}>Ukloni</button>
            )}
          </div>
        ))}

        <div className="mb-3">
          <button className="btn btn-link" onClick={addBenefit}>+ Dodaj još jedan benefit</button>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Otkaži</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Spremi</button>
        </div>
      </div>
    </div>
  );
};

export default AddBenefitsForm;
