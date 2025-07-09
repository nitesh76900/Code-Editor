import React, { useContext, useEffect, useState } from "react";
import { ProjectContext } from "../context/ProjectContext";
import { SocketContext } from "../context/SocketContext";
import EditorComponent from "../components/EditorComponent";
import ChatBox from "../components/ChatBox";
import api from "../api/api";
import { Save, History, RotateCcw, MessageCircle, Code, Users, Clock } from "lucide-react";

const Editor = () => {
  const { currentProject, fetchProject, setCurrentProject } = useContext(ProjectContext);
  const { socket } = useContext(SocketContext);
  const [versions, setVersions] = useState([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isReverting, setIsReverting] = useState({});

  const id = window.location.pathname.split("/").pop();

  const handleCodeChange = async (content) => {
    setIsLoading(true);
    setError("");
    try {
      await api.put(`/projects/${id}`, { content });
      setCurrentProject((prev) => ({ ...prev, content }));
    } catch (error) {
      setError(error.response?.data?.message|| error || "Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const saveVersion = async () => {
    setIsSaving(true);
    setError("");
    try {
      await api.post(`/versions/${id}/version`);
      fetchVersions();
    } catch (error) {
      setError(error.response?.data?.message|| error || "Failed to save version");
    } finally {
      setIsSaving(false);
    }
  };

  const revertVersion = async (versionId) => {
    setIsReverting((prev) => ({ ...prev, [versionId]: true }));
    setError("");
    try {
      await api.post(`/versions/${id}/revert/${versionId}`);
      fetchProject(id);
    } catch (error) {
      setError(error.response?.data?.message|| error || "Failed to revert version");
    } finally {
      setIsReverting((prev) => ({ ...prev, [versionId]: false }));
    }
  };

  const fetchVersions = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get(`/versions/${id}/versions`);
      setVersions(response.data);
    } catch (error) {
      setError(error.response?.data?.message|| error || "Failed to fetch versions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get(`/chat/${id}/chat`);
      setCurrentProject((prev) => ({
        ...prev,
        messages: response.data || [],
      }));
    } catch (error) {
      setError(error.response?.data?.message|| error || "Failed to fetch chat history");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError("");
    Promise.all([fetchProject(id), fetchVersions(), fetchChatHistory()])
      .catch((err) => setError(err.response?.data?.message|| err || "Failed to load project data"))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading || !currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm z-50">
          {error}
        </div>
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2 sm:py-2">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{currentProject.title}</h1>
                <p className="text-gray-600 text-sm">Collaborative Editor</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={saveVersion}
                className="bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-1 sm:space-x-2 disabled:opacity-50"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white" />
                ) : (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Save Version</span>
                  </>
                )}
              </button>
              <button
                onClick={() => setShowVersionHistory(!showVersionHistory)}
                className="bg-gray-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 flex items-center space-x-1 sm:space-x-2"
              >
                <History className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>History</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="p-2 sm:p-4">
                <EditorComponent project={currentProject} onChange={handleCodeChange} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {showVersionHistory && (
              <div className="bg-white rounded-xl shadow-md border overflow-hidden">
                <div className="border-b bg-gray-100 px-4 py-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <History className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Version History
                  </h3>
                </div>
                <div className="max-h-80 sm:max-h-96 overflow-y-auto">
                  {versions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No versions saved yet</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {versions.map((version) => (
                        <div
                          key={version._id}
                          className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900">
                              {version.savedBy.username}
                            </div>
                            <button
                              onClick={() => revertVersion(version._id)}
                              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center space-x-1 disabled:opacity-50"
                              disabled={isReverting[version._id]}
                            >
                              {isReverting[version._id] ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
                              ) : (
                                <>
                                  <RotateCcw className="w-3 h-3 sm:w-3 sm:h-3" />
                                  <span>Revert</span>
                                </>
                              )}
                            </button>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(version.savedAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-md border overflow-hidden">
              <div className="border-b bg-gray-100 px-4 py-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Team Chat
                </h3>
              </div>
              <div className="h-80 sm:h-96">
                <ChatBox projectId={id} messages={currentProject.messages || []} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;