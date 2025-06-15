import React from 'react';
import '../../styles/BenefitEditRow.css';

const BenefitEditRow = ({ benefit, index, onChange, onDelete }) => {
  // Opcije za Tip i Status
  const benefitTypes = ['Bonus', 'Zdravstveno osiguranje', 'Penzijski fond'];
  const benefitStatuses = ['Aktivan', 'Neaktivan'];

  return (
    <div className="benefit-row-edit">
      <div className="form-group mb-0">
        <label>Type</label>
        <select
          className="form-control"
          value={benefit.type}
          onChange={(e) => onChange(index, 'type', e.target.value)}
        >
          <option value="">Odaberite</option>
          {benefitTypes.map((type, idx) => (
            <option key={idx} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-0">
        <label>Status</label>
        <select
          className="form-control"
          value={benefit.status}
          onChange={(e) => onChange(index, 'status', e.target.value)}
        >
          <option value="">Odaberite</option>
          {benefitStatuses.map((status, idx) => (
            <option key={idx} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Details</label>
        <textarea
          className="form-control"
          rows="2"
          value={benefit.details}
          onChange={(e) => onChange(index, 'details', e.target.value)}
          placeholder="Optional"
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
