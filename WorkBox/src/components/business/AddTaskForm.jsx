import React, { useState } from "react";

function AddTaskForm({ projectId, onTaskAdded }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("In progress");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Primer payloada, prilagodi po potrebi
    const newTask = {
      name,
      description,
      status,
      project: { id: projectId },
      // Možeš dodati user ako želiš, ili ostaviti null
    };

    fetch(`http://localhost:8082/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add task");
        return res.json();
      })
      .then((data) => {
        onTaskAdded(data); // prosledi novi task natrag ProjectTaskManageru
        setName("");
        setDescription("");
        setStatus("In progress");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Task</h3>
      <input
        type="text"
        placeholder="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <br />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="In progress">In progress</option>
        <option value="Completed">Completed</option>
        <option value="Pending">Pending</option>
      </select>
      <br />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default AddTaskForm;
