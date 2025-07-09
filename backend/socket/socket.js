const { Server } = require("socket.io");
const { saveMessage } = require("../controllers/chatController");
const Project = require("../models/Project");
const User = require("../models/User");

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  const projectUsers = new Map();

  io.on("connection", (socket) => {
    console.log("Socket.IO client connected:", socket.id);

    socket.on("join-room", async (projectId, userId) => {
      try {
        console.log("JOIN-ROOM CALLED WITH", projectId, userId);

        if (!projectId || !userId) {
          console.error("Invalid projectId or userId:", { projectId, userId });
          socket.emit("error", { message: "Invalid projectId or userId" });
          return;
        }

        const project = await Project.findById(projectId);
        if (!project) {
          console.error("Project not found:", projectId);
          socket.emit("error", { message: "Project not found" });
          return;
        }

        const user = await User.findById(userId).select("username");
        if (!user) {
          console.error("User not found:", userId);
          socket.emit("error", { message: "User not found" });
          return;
        }

        socket.join(projectId);
        console.log(`User ${userId} joined room ${projectId}`);

        if (!projectUsers.has(projectId)) {
          projectUsers.set(projectId, new Set());
        }
        projectUsers
          .get(projectId)
          .add({ id: userId, username: user.username });

        io.to(projectId).emit(
          "users-update",
          Array.from(projectUsers.get(projectId))
        );
        io.to(projectId).emit("user-joined", { userId });
      } catch (error) {
        console.error("Join room error:", error.message, error.stack);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    socket.on("code-change", async ({ projectId, content, userId }) => {
      try {
        const project = await Project.findById(projectId);
        if (
          project &&
          (project.owner.equals(userId) ||
            project.collaborators.includes(userId))
        ) {
          project.content = content;
          project.lastEditedBy = userId;
          project.lastEditedAt = new Date();
          await project.save();
          socket.to(projectId).emit("code-change", { content, userId });
          console.log(`Code change in project ${projectId} by user ${userId}`);
        }
      } catch (error) {
        console.error("Code change error:", error.message);
      }
    });

    socket.on("chat-message", async ({ projectId, userId, message }) => {
      try {
        const savedMessage = await saveMessage({
          projectId,
          sender: userId,
          message,
        });
        io.to(projectId).emit("new-message", savedMessage);
        console.log(`Chat message in project ${projectId}:`, message);
      } catch (error) {
        console.error("Chat message error:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket.IO client disconnected:", socket.id);
      projectUsers.forEach((users, projectId) => {
        users.forEach((user) => {
          if (user.id === socket.id) {
            users.delete(user);
            io.to(projectId).emit("users-update", Array.from(users));
          }
        });
        if (users.size === 0) {
          projectUsers.delete(projectId);
        }
      });
      socket.broadcast.emit("user-disconnected");
    });
  });
};