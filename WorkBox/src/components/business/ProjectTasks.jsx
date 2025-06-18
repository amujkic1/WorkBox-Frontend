import React, { useState, useEffect } from "react";

function ProjectTasks({ tasks, onTaskUpdated }) {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch all users (ako ih želiš prikazati u select opciji)
    fetch("http://localhost:8082/users")
      .then((res) => res.json())
      .then((data) => {
        const userList = data._embedded?.userList || [];
        setUsers(userList);
      })
      .catch((err) => console.error("Failed to fetch users:", err));
  }, []);

  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setForm({
      name: task.name,
      description: task.description,
      status: task.status,
      startDate: task.startDate || "",
      endDate: task.endDate || "",
      submissionDate: task.submissionDate || "",
      userId: task.user?.id || "",
      projectId: task.project?.id || ""
    });
  };

  const cancelEditing = () => {
    setEditingTaskId(null);
    setForm({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (taskId) => {
    const updatedTask = {
      name: form.name,
      description: form.description,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      submissionDate: form.submissionDate,
      project: { id: form.projectId },
      user: form.userId ? { id: form.userId } : null
    };

    fetch(`http://localhost:8082/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask)
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update task");
        return res.json();
      })
      .then((updated) => {
        onTaskUpdated(updated);
        setEditingTaskId(null);
      })
      .catch((err) => alert("Error: " + err.message));
  };

  if (!tasks.length) return <p>No tasks for this project yet.</p>;

  return (
    <div>
      <h3>Tasks List</h3>
      <ul className="list-group">
        {tasks.map((task) => (
          <li key={task.id} className="list-group-item">
            {editingTaskId === task.id ? (
              <>
                <input
                  className="form-control mb-2"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Task Name"
                />
                <textarea
                  className="form-control mb-2"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
                <select
                  className="form-select mb-2"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                </select>

                <input
                  className="form-control mb-2"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                />
                <input
                  className="form-control mb-2"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                />
                <input
                  className="form-control mb-2"
                  type="date"
                  name="submissionDate"
                  value={form.submissionDate}
                  onChange={handleChange}
                />

                <select
                  className="form-select mb-3"
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                >
                  <option value="">-- Assign User --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </select>

                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-sm btn-success me-2"
                    onClick={() => handleSave(task.id)}
                  >
                    Save
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <strong>{task.name}</strong> — {task.description} — <em>{task.status}</em>
                <br />
                <small>
                  Start: {task.startDate || "N/A"}, End: {task.endDate || "N/A"},{" "}
                  Submission: {task.submissionDate || "N/A"}
                  <br />
                  Assigned to:{" "}
                  {task.user ? `${task.user.firstName} ${task.user.lastName}` : "None"}
                </small>
                <br />
                <button className="btn btn-sm btn-outline-primary mt-2" onClick={() => startEditing(task)}>
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectTasks;
