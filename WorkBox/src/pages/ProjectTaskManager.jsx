import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProjectTasks from "../components/business/ProjectTasks";
import AddTaskForm from "../components/business/AddTaskForm";

function ProjectTaskManager() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:8082/projects/${projectId}`)
      .then((res) => res.json())
      .then((data) => setProject(data))
      .catch((err) => console.error("Failed to fetch project", err));

    fetch(`http://localhost:8082/tasks/project/${projectId}`)
      .then((res) => res.json())
      .then((data) => {
        const taskList = data._embedded?.taskList || [];
        setTasks(taskList);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      });
  }, [projectId]);

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="text-primary">Project: {project?.title}</h2>
      <button className="btn btn-secondary mb-3" onClick={() => navigate("/business")}>
        ← Back to Dashboard
      </button>

      <AddTaskForm
        projectId={projectId}
        teamId={project?.team?.id}
        onTaskAdded={handleTaskAdded}
      />
      <ProjectTasks tasks={tasks} onTaskUpdated={handleTaskUpdated} />
    </div>
  );
}

export default ProjectTaskManager;
