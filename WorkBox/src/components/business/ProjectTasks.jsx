import React from "react";

function ProjectTasks({ tasks }) {
  if (!tasks.length) return <p>No tasks for this project yet.</p>;

  return (
    <div className="row">
      {tasks.map((task) => (
        <div key={task.id} className="col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">{task.name}</h5>
              <p className="card-text">{task.description}</p>
              <p className="card-text">
                <strong>Status:</strong> {task.status}
              </p>
              <p className="card-text">
                <strong>User:</strong>{" "}
                {task.user
                  ? `${task.user.firstName} ${task.user.lastName}`
                  : "Unassigned"}
              </p>
              <p className="card-text">
                <strong>Start:</strong> {task.startDate || "N/A"}
              </p>
              <p className="card-text">
                <strong>End:</strong> {task.endDate || "N/A"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectTasks;
