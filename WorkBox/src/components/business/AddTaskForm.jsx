import React, { useState, useEffect } from "react";

function AddTaskForm({ projectId, onTaskAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In progress");
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:8082/projects/${projectId}`)
      .then((res) => res.json())
      .then((proj) => {
        setProject(proj);
        return fetch(`http://localhost:8082/users`);
      })
      .then((res) => res.json())
      .then((data) => {
        const allUsers = data._embedded?.userList || [];
        const teamUsers = allUsers.filter(
          (user) => user.team?.id === project?.team?.id
        );
        setUsers(teamUsers);
      })
      .catch((err) => console.error("Error loading users or project:", err));
  }, [projectId, project?.team?.id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      name,
      description,
      status,
      project: { id: projectId },
      user: { id: selectedUserId },
    };

    fetch(`http://localhost:8082/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then((data) => {
        onTaskAdded(data);
        setName("");
        setDescription("");
        setStatus("In progress");
        setSelectedUserId("");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h4 className="mb-3">Add New Task</h4>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Task Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(parseInt(e.target.value))}
          required
        >
          <option value="">Assign user from project team</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary">
        Add Task
      </button>
    </form>
  );
}

export default AddTaskForm;
