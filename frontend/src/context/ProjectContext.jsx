import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/api";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      // console.log("Projects response", response);
      setProjects(response.data);
    } catch (error) {
      console.error("Fetch projects error:", error);
    }
  };

  const fetchProject = async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      console.log("Project response", response);
      setCurrentProject(response.data);
    } catch (error) {
      console.error("Fetch project error:", error);
    }
  };

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  useEffect(() => {
    if (socket && currentProject) {
      socket.emit("join-room", currentProject._id, user._id);
      socket.on("code-change", ({ content }) => {
        setCurrentProject((prev) => ({ ...prev, content }));
      });
      socket.on("new-message", (message) => {
        setCurrentProject((prev) => ({
          ...prev,
          messages: [message, ...(prev.messages || [])],
        }));
      });
      return () => {
        socket.off("code-change");
        socket.off("new-message");
      };
    }
  }, [socket, currentProject]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        fetchProjects,
        fetchProject,
        setCurrentProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
