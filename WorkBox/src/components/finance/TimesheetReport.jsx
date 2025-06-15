import React from 'react';
import PropTypes from 'prop-types';

export default function TimesheetReport({ data }) {
  if (!data || data.length === 0) {
    return <p>No data available for Timesheet Report.</p>;
  }

  return (
    <div className="card mt-4 border-1 border-gradient-dark rounded shadow-sm">
      <div className="card-body">
        <h4 className="card-title">Timesheet Report</h4>
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>User ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Total Working Hours</th>
                <th>Total Overtime Hours</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.userId}</td>
                  <td>{item.firstName}</td>
                  <td>{item.lastName}</td>
                  <td>{item.totalWorkingHours}</td>
                  <td>{item.totalOvertimeHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

TimesheetReport.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.number,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
      totalWorkingHours: PropTypes.number,
      totalOvertimeHours: PropTypes.number,
    })
  ).isRequired,
};