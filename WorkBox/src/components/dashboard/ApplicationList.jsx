const ApplicationList = ({ applications, onStatusChange }) => {

  const handleApplication = (id, status) => {
    fetch(`http://localhost:8080/hr/applications/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({status})
    })
      .then(async response => {
        if (response.ok) {
          const result = await response.json();
          console.log("Application updated", result);
          onStatusChange()
        } else {
          console.log("Failed to update application")
        }
      })
      .catch(() => setErrorMessage('Failed to update application.'));
  };

  return (
    <div className="card-body">
      <table className="table table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Documentation/Resume</th>
            <th>Points</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-muted py-4">No applications</td>
            </tr>
          ) : (
            applications.map((app, index) => (
              <tr key={index}>
                <td className="fw-semibold">{app.firstName}</td>
                <td className="text-muted">{app.email}</td>
                <td>
                  <a
                    href={app.documentationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    {app.documentationLink}
                  </a>
                </td>
                <td className="fw-medium">{app.points}</td>
                <td>
                  <span
                    className={`badge px-3 py-2 rounded-pill ${
                      app.status === "Accepted"
                        ? "bg-success text-white"
                        : app.status === "Rejected"
                        ? "bg-danger text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-success"
                      title="Accept"
                      onClick={() => handleApplication(app.id, "Accepted")}
                    >
                      ✔️
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Decline"
                      onClick={() => handleApplication(app.id, "Rejected")}
                    >
                      ❌
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationList;