import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const connectedRef = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (connectedRef.current) return;

    const URL = "http://localhost:3000";
    console.log("Attempting to connect to Socket.IO server at:", URL);

    const socketInstance = io(URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 60000,
    });

    socketRef.current = socketInstance;
    connectedRef.current = true;

    socketInstance.on("connect", () => {
      console.log("✅ Socket.IO connected:", socketInstance.id);
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", (reason) => {
      console.warn("❌ Socket.IO disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("🔥 Socket.IO connect_error:", err.message, err);
    });

    socketInstance.on("error", (err) => {
      console.error("🔥 Socket.IO error:", err);
    });

    return () => {
      console.log("🛑 Socket.IO client cleanup initiated");
      socketInstance.disconnect();
      socketRef.current = null;
      connectedRef.current = false;
      setSocket(null);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};