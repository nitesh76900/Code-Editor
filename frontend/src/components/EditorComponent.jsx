import React, { useEffect, useRef, useContext, useState } from "react";
import Editor from "@monaco-editor/react";
import { SocketContext } from "../context/SocketContext";
import { AuthContext } from "../context/AuthContext";
import { Code, Users, Wifi, WifiOff, Maximize2 } from "lucide-react";

const EditorComponent = ({ project, onChange }) => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const editorRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState("");
  const joinedRoomRef = useRef(false);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
      if (socket && isConnected) {
        socket.emit("code-change", {
          projectId: project._id,
          content: value,
          userId: user._id,
        });
      }
    });
  };

  useEffect(() => {
    if (!socket) {
      setIsConnected(false);
      setError("Socket not initialized");
      return;
    }

    const onConnect = () => {
      setIsConnected(true);
      setError("");
      if (!joinedRoomRef.current && project?._id && user?._id) {
        socket.emit("join-room", project?._id, user._id);
        joinedRoomRef.current = true;
      }
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setError("Disconnected from server");
      joinedRoomRef.current = false;
    };

    const onConnectError = (err) => {
      setIsConnected(false);
      setError(err.message || "Connection error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, [socket, project?._id, user?._id]);

  useEffect(() => {
    if (!socket || !project?._id) return;

    const handleReceiveCode = ({ content, userId }) => {
      if (userId === user._id) return;

      const editor = editorRef.current;
      if (editor && editor.getValue() !== content) {
        const currentModel = editor.getModel();
        editor.executeEdits(null, [
          {
            range: currentModel.getFullModelRange(),
            text: content,
          },
        ]);
      }
    };

    socket.on("code-change", handleReceiveCode);

    return () => {
      socket.off("code-change", handleReceiveCode);
    };
  }, [socket, project?._id, user._id]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getLanguageIcon = (language) => {
    const icons = {
      javascript: "🟨",
      python: "🐍",
      java: "☕",
      typescript: "🔷",
      html: "🌐",
      css: "🎨",
      cpp: "⚡",
      c: "🔧",
      go: "🐹",
      rust: "🦀",
      php: "🐘",
      ruby: "💎",
    };
    return icons[language] || "📝";
  };

  const getLanguageColor = (language) => {
    const colors = {
      javascript: "bg-yellow-100 text-yellow-800",
      python: "bg-green-100 text-green-800",
      java: "bg-orange-100 text-orange-800",
      typescript: "bg-blue-100 text-blue-800",
      html: "bg-red-100 text-red-800",
      css: "bg-purple-100 text-purple-800",
      cpp: "bg-indigo-100 text-indigo-800",
      c: "bg-gray-100 text-gray-800",
      go: "bg-cyan-100 text-cyan-800",
      rust: "bg-orange-100 text-orange-800",
      php: "bg-violet-100 text-violet-800",
      ruby: "bg-red-100 text-red-800",
    };
    return colors[language] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className={`bg-white rounded-lg border shadow-sm overflow-hidden ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm mx-4">
          {error}
        </div>
      )}
      <div className="bg-gray-50 border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Code className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">Code Editor</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getLanguageIcon(project.language)}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(
                  project.language
                )}`}
              >
                {project.language}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">Disconnected</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {project.collaborators?.length || 0}{" "}
                {project.collaborators?.length === 1 ? "user" : "users"}
              </span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Editor
          height={isFullscreen ? "calc(100vh - 64px)" : "500px"}
          language={project.language || "javascript"}
          value={project.content || ""}
          theme="light"
          onMount={handleEditorDidMount}
          onChange={(value) => {
            if (editorRef.current?.getValue() !== value) {
 onChange(value);
            }
          }}
          options={{
            fontSize: 14,
            lineHeight: 22,
            fontFamily: "JetBrains Mono, Fira Code, Monaco, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            renderWhitespace: "selection",
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: true,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            roundedSelection: true,
            scrollbar: {
              vertical: "auto",
              horizontal: "auto",
              useShadows: true,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />

        {!isConnected && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 text-center shadow-xl">
              <WifiOff className="w-12 h-12 text-blue-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Connection Lost
              </h3>
              <p className="text-gray-600 text-sm">
                Trying to reconnect... Your changes are saved locally.
              </p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorComponent;