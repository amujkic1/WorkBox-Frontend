import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export default function EmployeeStatusReport({ data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openCards, setOpenCards] = useState(new Set());

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>There is no data available for the employee status report.</p>;
  }

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return data;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return data.filter(employee =>
      employee.firstName.toLowerCase().includes(lowercasedSearchTerm) ||
      employee.lastName.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [data, searchTerm]);

  const toggleCard = (employeeId) => {
    setOpenCards(prevOpenCards => {
      const newOpenCards = new Set(prevOpenCards);
      if (newOpenCards.has(employeeId)) {
        newOpenCards.delete(employeeId);
      } else {
        newOpenCards.add(employeeId);
      }
      return newOpenCards;
    });
  };

  return (
    <div className="mt-4">
      <h4 className="mb-3">Employee status report</h4>

      {/* Okvir za kartice SADA UKLJUČUJE I TRAŽILICU */}
      <div className="card border-1 border-gradient-dark rounded shadow-sm p-3">
        {/* Polje za pretraživanje - PREMJEŠTENO OVDJE */}
        <div className="mb-3"> {/* mb-3 dodaje razmak ispod tražilice */}
          <input
            type="text"
            className="form-control border-2 border-gradient-dark p-3"
            placeholder="Search employees by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Prikaz filtriranih zaposlenika */}
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => {
            const isCardOpen = openCards.has(employee.id);
            return (
              <div key={employee.id} className="card mb-3 border-1 rounded shadow-sm">
                <div
                  className="card-header d-flex justify-content-between align-items-center"
                  onClick={() => toggleCard(employee.id)}
                  style={{ cursor: 'pointer' }}
                  aria-expanded={isCardOpen}
                  aria-controls={`collapseEmployee${employee.id}`}
                >
                  <h5 className="mb-0">
                    {employee.firstName} {employee.lastName}
                  </h5>
                  <i className={`fas ${isCardOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                </div>

                <div
                  className={`collapse ${isCardOpen ? 'show' : ''}`}
                  id={`collapseEmployee${employee.id}`}
                >
                  <div className="card-body">
                    <p className="card-text mb-1">
                      <strong>Status:</strong> {employee.status || 'Not defined'}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Date of employment:</strong> {employee.employmentDate || 'Not defined'}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Number of working hours:</strong> {employee.numberOfWorkingHours || 'Not defined'}
                    </p>

                    {employee.employeeBenefits && employee.employeeBenefits.length > 0 && (
                      <>
                        <h6 className="mt-2"><strong>Benefits:</strong></h6>
                        <ul className="list-group list-group-flush mt-0">
                          {employee.employeeBenefits.map((benefit, index) => (
                            <li key={index} className="list-group-item">
                              <strong>Type:</strong> {benefit.type} <br />
                              <strong>Status:</strong> {benefit.status} <br />
                              <strong>Details:</strong> {benefit.details}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center">No employees found matching your search.</p>
        )}
      </div>
    </div>
  );
}

EmployeeStatusReport.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      status: PropTypes.string,
      employmentDate: PropTypes.string,
      numberOfWorkingHours: PropTypes.number,
      employeeBenefits: PropTypes.arrayOf(
        PropTypes.shape({
          type: PropTypes.string,
          status: PropTypes.string,
          details: PropTypes.string,
          employeeBenefitId: PropTypes.number,
        })
      ),
    })
  ).isRequired,
};