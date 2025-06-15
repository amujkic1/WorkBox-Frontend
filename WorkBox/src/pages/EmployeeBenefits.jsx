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

  const fetchData = () => {
    setLoading(true);
    axios
      .get('http://localhost:8080/finance/employee_benefits/grouped_by_user')
      .then(response => {
        setUserBenefits(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('An error occurred while loading data.');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(); // učitavanje samo jednom na početku
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
          placeholder="Search by first or last name"
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
          Add benefits
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredUsers.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div className="row">
          {filteredUsers.map(user => (
            <UserBenefitCard key={user.userId} user={user} />
          ))}
        </div>
      )}

      {showAddForm && (
        <AddBenefitsForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchData} 
        />
      )}
    </div>
  );
}
