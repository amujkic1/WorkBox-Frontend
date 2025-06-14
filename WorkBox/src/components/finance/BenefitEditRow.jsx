import React from 'react';
import '../../styles/BenefitEditRow.css';

const BenefitEditRow = ({ benefit, index, onChange, onDelete }) => {
  return (
    <div className="benefit-row-edit">
      <div className="input-group">
        <label>Type:</label>
        <input
          type="text"
          value={benefit.type}
          onChange={(e) => onChange(index, 'type', e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Status:</label>
        <input
          type="text"
          value={benefit.status}
          onChange={(e) => onChange(index, 'status', e.target.value)}
        />
      </div>

      <div className="input-group details-group">
        <label>Details:</label>
        <textarea
          rows="2"
          value={benefit.details}
          onChange={(e) => onChange(index, 'details', e.target.value)}
        />
      </div>

      <button
        className="btn btn-sm btn-danger delete-btn"
        onClick={() => onDelete(benefit.employeeBenefitId)}
      >
        Delete
      </button>
    </div>
  );
};

export default BenefitEditRow;
