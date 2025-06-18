import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ProjectTasks from "../components/business/ProjectTasks";
import AddTaskForm from "../components/business/AddTaskForm";

function ProjectTaskManager() {
  const { projectId } = useParams();  // Učitaj projectId iz URL parametra
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!projectId) return;
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
  }, [projectId]);

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  return (
    <div>
      <h2>Project Tasks for Project ID: {projectId}</h2>
      <AddTaskForm projectId={projectId} onTaskAdded={handleTaskAdded} />
      <ProjectTasks projectId={projectId} tasks={tasks} />
    </div>
  );
}

export default ProjectTaskManager;
