import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserBenefitCard from './UserBenefitCard';
import AddBenefitsForm from '../components/finance/AddBenefitsForm';

export default function EmployeeBenefits() {
  const [userBenefits, setUserBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get('http://localhost:8080/finance/employee_benefits/grouped_by_user')
        .then(response => {
          setUserBenefits(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Došlo je do greške prilikom učitavanja podataka.');
          setLoading(false);
        });
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const filteredUsers = userBenefits.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h2 className="mb-4">Employee benefits</h2>

      <div className="d-flex mb-4 gap-2 align-items-center">
        <input
          type="text"
          placeholder="Pretraži po imenu ili prezimenu"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            padding: '0.5rem',
            width: '100%',
            maxWidth: '400px',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
        <button
          className="btn btn-success"
          onClick={() => setShowAddForm(true)}
          style={{ whiteSpace: 'nowrap' }}
        >
          Dodaj benefit
        </button>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p>Nema dostupnih podataka.</p>
      ) : (
        <div className="row">
          {filteredUsers.map(user => (
            <UserBenefitCard key={user.userId} user={user} />
          ))}
        </div>
      )}

      {showAddForm && <AddBenefitsForm onClose={() => setShowAddForm(false)} />}
    </div>
  );
}