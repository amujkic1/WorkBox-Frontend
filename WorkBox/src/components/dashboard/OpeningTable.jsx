import { useState, useEffect } from 'react';
import OpeningForm from '../forms/OpeningForm';

const OpeningTable = ({ openings, onRefreshOpenings }) => {

  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState(null);
  const [deleteAlert, setDeleteAlert] = useState(false);
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-GB');
  };

  const handleDeleteOpening = (id) => {
  if (!window.confirm("Are you sure you want to delete this opening?")) return;

  fetch(`http://localhost:8080/hr/openings/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
    .then((response) => {
      if (response.ok) {
        setDeleteAlert(true);
        setTimeout(() => setDeleteAlert(false), 4000);
        //alert("Opening successfully deleted.");
        onRefreshOpenings();
      } else {
        alert("Failed to delete the opening.");
      }
    })
    .catch((error) => {
      console.error("Error deleting opening:", error);
      alert("An error occurred while deleting the opening.");
    });
};


    const handleUpdateOpening = (data) => {

    const id = selectedOpening?.id;    

    fetch(`http://localhost:8080/hr/openings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        openingName: data.title,
        description: data.description,
        conditions: data.conditions.map(c => c.value).join(", "),
        benefits: data.benefits.map(b => b.value).join(", "), 
        startDate: data.startDate,
        endDate: data.endDate,
        result: "Pending",
        userId: 1
      })
    })
      .then(async response => {
        if (response.ok) {
          const result = await response.json();

              setShowUpdateModal(false); 
    onRefreshOpenings(); 

        } else {
          console.log("greska", response)
        }
      })
      .catch((err) => {console.error('Failed to update the opening.', err);});
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
                  <button className="btn btn-sm btn-primary me-2" onClick={() => {setSelectedOpening({  ...opening,
                                                                                                            title: opening.openingName, // za kompatibilnost sa OpeningForm
                                                                                                    });
                   setShowUpdateModal(true)} }>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteOpening(opening.id)}>
                      Close
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {deleteAlert && (
        <div className="alert alert-success alert-dismissible fade show mt-3" role="alert">
          <strong>Success!</strong> Opening has been deleted.
          <button type="button" className="btn-close" onClick={() => setDeleteAlert(false)}></button>
        </div>
      )}
    </div>

    {showUpdateModal && (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update an opening</h5>
              <button type="button" className="btn-close" onClick={() => setShowUpdateModal(false)}></button>
            </div>
            <div className="modal-body">
              <OpeningForm onSubmit={handleUpdateOpening} defaultValues={selectedOpening} buttonLabel='Update opening' />
            </div>
          </div>
        </div>
      </div>
    )}

  </div>  
);}

export default OpeningTable;