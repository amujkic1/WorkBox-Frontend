const ApplicationList = ({applications}) => {
    return(
        <>
        <div className="card-body">
            <table className="table table-hover">
              <thead>
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
                    <td colSpan="6" className="text-center">No applications</td>
                  </tr>
                ) : (
                  applications.map((app, index) => (
                    <tr key={index}>
                      <td>{app.firstName}</td>
                      <td>{app.email}</td>
                      <td>
                        <a href={app.documentationLink} target="_blank" rel="noopener noreferrer">
                          {app.documentationLink}
                        </a>
                      </td>
                      <td>{app.points}</td>
                      <td>
                        <span className={`badge ${app.status === "Accepted" ? "bg-success"
                                                : app.status === "Rejected" ? "bg-danger"
                                                : "bg-secondary"
                                                  }`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary me-2">Accept</button>
                        <button className="btn btn-sm btn-danger">Decline</button>
                      </td>
                    </tr>
                  ))
                )}
                    </tbody>
            </table>
          </div>
        </>
    )
}

export default ApplicationList;