import React from 'react';
import PropTypes from 'prop-types';

export default function EmployeeStatusReport({ data }) {
  if (!data) {
    return <p>No data available for Employee Status Report.</p>;
  }

  return (
    <div className="card mt-4 border-1 border-gradient-dark rounded shadow-sm">
      <div className="card-body">
        <h4 className="card-title">Employee Status Report</h4>
        <pre className="bg-light p-3 rounded">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}

EmployeeStatusReport.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]).isRequired,
};