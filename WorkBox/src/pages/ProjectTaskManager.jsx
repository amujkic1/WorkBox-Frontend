import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectTasks from "../components/business/ProjectTasks";
import AddTaskForm from "../components/business/AddTaskForm";

function ProjectTaskManager() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");

  useEffect(() => {
    if (!projectId) return;

    // Fetch tasks
    fetch(`http://localhost:8082/tasks/project/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        const fetchedTasks = data._embedded?.taskList || [];
        setTasks(fetchedTasks);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      });

    // Fetch project title
    fetch(`http://localhost:8082/projects/${projectId}`)
      .then((res) => res.json())
      .then((project) => {
        setProjectTitle(project.title || "Project");
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setProjectTitle("Project");
      });
  }, [projectId]);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">Tasks for: {projectTitle}</h2>
        <button className="btn btn-secondary" onClick={() => navigate("/business")}>
          ← Back to Dashboard
        </button>
      </div>

      <AddTaskForm projectId={projectId} onTaskAdded={handleTaskAdded} />
      <hr className="my-4" />
      <ProjectTasks tasks={tasks} />
    </div>
  );
}

export default ProjectTaskManager;
