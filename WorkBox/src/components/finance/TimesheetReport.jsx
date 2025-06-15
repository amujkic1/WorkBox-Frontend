import React from 'react';
import PropTypes from 'prop-types';
import DataTable from 'react-data-table-component'; // Importiranje DataTable komponente

export default function TimesheetReport({ data }) {
  if (!data || data.length === 0) {
    return <p>No data available for Timesheet Report.</p>;
  }

  const columns = [
    { name: 'User ID', selector: row => row.userId, sortable: true }, // Uklonjen pojedinačni style
    { name: 'First Name', selector: row => row.firstName, sortable: true }, // Uklonjen pojedinačni style
    { name: 'Last Name', selector: row => row.lastName, sortable: true }, // Uklonjen pojedinačni style
    { name: 'Total Working Hours', selector: row => row.totalWorkingHours, sortable: true }, // Uklonjen pojedinačni style
    { name: 'Total Overtime Hours', selector: row => row.totalOvertimeHours, sortable: true }, // Uklonjen pojedinačni style
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#4c91f5', // Plava boja za zaglavlje
        color: 'white',
        fontWeight: '600',
        fontSize: '140%',
        justifyContent: 'center', // Centriranje sadržaja u zaglavlju
      },
    },
    cells: { // Dodan cells objekat
      style: {
        justifyContent: 'center', // Centriranje sadržaja u ćelijama
      },
    },
    rows: {
      style: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#e9f2ff', // Plavi hover efekat
        },
        fontSize: '100%',
      },
    },
    pagination: {
      style: {
        fontSize: '90%',
      },
    },
  };

  return (
    <div className="card mt-4 border-1 border-gradient-dark rounded shadow-sm">
      <div className="card-body">
        <h3 className="card-title mb-4">Timesheet Report</h3>
        
        <DataTable className="shadow-sm rounded"
          columns={columns}
          data={data}
          pagination
          highlightOnHover
          responsive
          customStyles={customStyles}
        />
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