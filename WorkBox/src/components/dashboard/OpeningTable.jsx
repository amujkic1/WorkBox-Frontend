const OpeningTable = ({ openings }) => {
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB');
  };
  
  return (
  <div className="card mb-4 shadow-lg">
    <div className="card-header bg-white">
      <h5 className="mb-0">Active openings</h5>
    </div>
    <div className="card-body">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Applications</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {openings.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No openings right now.</td>
            </tr>
          ) : (
            openings.map((opening, index) => (
              <tr key={index}>
                <td>{opening.openingName}</td>
                <td>{formatDate(opening.startDate)}</td>
                <td>{formatDate(opening.endDate)}</td>
                <td>{opening.applicationCount ?? 0}</td>
                <td>
                  <span className={`badge ${opening.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                    {opening.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">View</button>
                  <button className="btn btn-sm btn-danger">Close</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);}

export default OpeningTable;