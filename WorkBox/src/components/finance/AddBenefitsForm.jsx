import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddBenefitsForm = ({ onClose, onSuccess }) => {
  const [users, setUsers] = useState([]);
  const [benefits, setBenefits] = useState([
    { type: '', status: '', details: '', userId: '' }
  ]);
  const [errorMessage, setErrorMessage] = useState('');  // Za greške pri unosu

  // Opcije za Tip i Status
  const benefitTypes = ['Bonus', 'Zdravstveno osiguranje', 'Penzijski fond'];
  const benefitStatuses = ['Aktivan', 'Neaktivan'];

  useEffect(() => {
    axios.get('http://localhost:8080/finance/users')
      .then(res => {
        const usersData = res.data._embedded ? Object.values(res.data._embedded)[0] : [];
        setUsers(usersData);
      })
      .catch(() => alert('Error loading users.'));
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

  const validateForm = () => {
    for (let i = 0; i < benefits.length; i++) {
      const { type, status, userId } = benefits[i];
      if (!type || !status || !userId) {
        setErrorMessage('All fields must be filled in (type, status, user).');
        setTimeout(() => {
          setErrorMessage(''); // Reset greške nakon 3 sekunde
        }, 3000); // Greška nestaje nakon 3 sekunde
        return false;
      }
    }
    setErrorMessage('');  // Reset greške ako je sve ok
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = benefits.map(b => ({
      type: b.type,
      status: b.status,
      details: b.details,  // Detalji nisu obavezni
      user: { userId: parseInt(b.userId, 10) }
    }));

    try {
      await axios.post('http://localhost:8080/finance/employee_benefits', payload);
      alert('Benefits have been successfully added.');
      onSuccess();
      onClose();   
    } catch (err) {
      console.error(err);
      alert('Error when saving benefits.');
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
          <h3>Add new benefits</h3>
        </div>

        {benefits.map((benefit, idx) => (
          <div key={idx} className="mb-3 border-bottom pb-3">
            <div className="form-group mb-2">
              <label>Employee</label>
              <select
                className="form-control"
                value={benefit.userId}
                onChange={e => handleChange(idx, 'userId', e.target.value)}
              >
                <option value="">Select</option>
                {users.map(user => (
                  <option key={user.userId} value={user.userId}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Type</label>
              <select
                className="form-control"
                value={benefit.type}
                onChange={e => handleChange(idx, 'type', e.target.value)}
              >
                <option value="">Select</option>
                {benefitTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Status</label>
              <select
                className="form-control"
                value={benefit.status}
                onChange={e => handleChange(idx, 'status', e.target.value)}
              >
                <option value="">Select</option>
                {benefitStatuses.map((status, index) => (
                  <option key={index} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Details</label>
              <input
                className="form-control"
                value={benefit.details}
                onChange={e => handleChange(idx, 'details', e.target.value)}
                placeholder="Optional"
              />
            </div>

            {benefits.length > 1 && (
              <button className="btn btn-danger mt-2" onClick={() => removeBenefit(idx)}>Remove</button>
            )}
          </div>
        ))}

        {errorMessage && (
          <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>
            {errorMessage}
          </div>
        )}

        <div className="mb-3">
          <button className="btn btn-link" onClick={addBenefit}>+ Add another benefit</button>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default AddBenefitsForm;
