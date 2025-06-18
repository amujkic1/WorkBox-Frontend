import React from "react";

function ProjectTasks({ tasks }) {
  if (!tasks.length) return <p>No tasks for this project yet.</p>;

  return (
    <div>
      <h3>Tasks List</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <b>{task.name}</b> — {task.description} — <i>{task.status}</i>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTasks;
