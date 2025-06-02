import DataTable from 'react-data-table-component';

const columns = [
  { name: 'Name', selector: row => row.name, sortable: true },
  { name: 'Position', selector: row => row.position },
  { name: 'Office', selector: row => row.office },
  { name: 'Age', selector: row => row.age },
  { name: 'Start Date', selector: row => row.startDate },
  { name: 'Salary', selector: row => row.salary },
];

const data = [
  { name: 'Tiger Nixon', position: 'System Architect', office: 'Edinburgh', age: 61, startDate: '2011/04/25', salary: '$320,800' },
  { name: 'Garrett Winters', position: 'Accountant', office: 'Tokyo', age: 63, startDate: '2011/07/25', salary: '$170,750' },
  // ...
];

export default function Tables() {
  return (
    <div className="container-fluid">
      <h1 className="h3 mb-2 text-gray-800">Tables</h1>
      <DataTable
        title="DataTables Example"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
      />
    </div>
  );
}
