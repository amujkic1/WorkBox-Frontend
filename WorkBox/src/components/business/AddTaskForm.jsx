import React, { useState, useEffect } from "react";

function AddTaskForm({ projectId, teamId, onTaskAdded }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "In progress",
    startDate: "",
    endDate: "",
    submissionDate: "",
    userId: ""
  });

  const [teamUsers, setTeamUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8082/users")
      .then((res) => res.json())
      .then((data) => {
        const users = data._embedded?.userList || [];
        const filtered = users.filter(user => user.team?.id === teamId);
        setTeamUsers(filtered);
      });
  }, [teamId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      name: form.name,
      description: form.description,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate,
      submissionDate: form.submissionDate,
      project: { id: projectId },
      user: form.userId ? { id: form.userId } : null
    };

    fetch("http://localhost:8082/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    })
      .then(res => res.json())
      .then(data => {
        onTaskAdded(data);
        setForm({
          name: "",
          description: "",
          status: "In progress",
          startDate: "",
          endDate: "",
          submissionDate: "",
          userId: ""
        });
      })
      .catch(err => alert("Failed to add task: " + err.message));
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 border p-3 rounded">
      <h4>Add New Task</h4>

      <input className="form-control mb-2" type="text" name="name" placeholder="Task Name" value={form.name} onChange={handleChange} required />
      <textarea className="form-control mb-2" name="description" placeholder="Description" value={form.description} onChange={handleChange} />

      <select className="form-control mb-2" name="status" value={form.status} onChange={handleChange}>
        <option value="In progress">In progress</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>

      <input className="form-control mb-2" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      <input className="form-control mb-2" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
      <input className="form-control mb-2" type="date" name="submissionDate" value={form.submissionDate} onChange={handleChange} />

      <select className="form-control mb-3" name="userId" value={form.userId} onChange={handleChange}>
        <option value="">Assign to User</option>
        {teamUsers.map(user => (
          <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>
        ))}
      </select>

      <button type="submit" className="btn btn-primary">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
