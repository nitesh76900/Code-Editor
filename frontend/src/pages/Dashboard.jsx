import React, { useState, useContext, useEffect } from 'react';
import { ProjectContext } from '../context/ProjectContext';
import api from '../api/api';
import { Plus, Code, Users, Send, FileText, Calendar } from 'lucide-react';

const Dashboard = () => {
  const { projects, fetchProjects } = useContext(ProjectContext);
  const [title, setTitle] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [email, setEmail] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteLoading, setInviteLoading] = useState({});
  const [inviteError, setInviteError] = useState({});

  const createProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await api.post('/projects', { title, language });
      fetchProjects();
      setTitle('');
      setShowCreateForm(false);
    } catch (error) {
      setError(error.response?.data?.message|| error || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  const inviteCollaborator = async (projectId) => {
    setInviteLoading((prev) => ({ ...prev, [projectId]: true }));
    setInviteError((prev) => ({ ...prev, [projectId]: '' }));
    try {
      await api.post(`/projects/${projectId}/invite`, { email });
      fetchProjects();
      setEmail('');
    } catch (error) {
      setInviteError((prev) => ({
        ...prev,
        [projectId]: error.response?.data?.message|| error || 'Failed to invite collaborator',
      }));
    } finally {
      setInviteLoading((prev) => ({ ...prev, [projectId]: false }));
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setError('');
    fetchProjects()
      .catch((err) => setError(err.response?.data?.message|| err || 'Failed to load projects'))
      .finally(() => setIsLoading(false));
  }, []);

  const languageIcons = {
    javascript: '🟨',
    python: '🐍',
    java: '☕',
  };

  const languageColors = {
    javascript: 'bg-yellow-200 text-yellow-900',
    python: 'bg-green-200 text-green-900',
    java: 'bg-orange-200 text-orange-900',
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading projects...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm z-50">
          {error}
        </div>
      )}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 text-sm mt-1">Manage your coding projects</p>
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95 flex items-center space-x-2"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 border">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white shadow-sm text-sm sm:text-base"
                  disabled={isLoading}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
              <div className="flex space-x-2 sm:space-x-3">
                <button
                  onClick={createProject}
                  className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
                  ) : (
                    'Create Project'
                  )}
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Your Projects</h2>
            <div className="text-sm text-gray-500">
              {projects.length} {projects.length === 1 ? 'project' : 'projects'}
            </div>
          </div>

          {projects.length === 0 && !isLoading ? (
            <div className="text-center py-10 sm:py-12">
              <FileText className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 text-sm mb-3 sm:mb-4">Get started by creating your first project</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Create Project
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-xl shadow-md border hover:shadow-lg transition-all duration-300 overflow-hidden group transform hover:scale-105"
                >
                  <div className="p-4 sm:p-6">
                    {inviteError[project._id] && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {inviteError[project._id]}
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Code className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-base sm:text-lg">{languageIcons[project.language]}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${languageColors[project.language]}`}>
                              {project.language}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-3 sm:mb-4">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>

                    <a
                      href={`/editor/${project._id}`}
                      className="block w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105 active:scale-95 mb-3 sm:mb-4"
                    >
                      Open Editor
                    </a>

                    <div className="border-t pt-3 sm:pt-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Invite Collaborator</span>
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="email"
                          placeholder="Enter email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                          disabled={inviteLoading[project._id]}
                        />
                        <button
                          onClick={() => inviteCollaborator(project._id)}
                          className="bg-gray-100 text-gray-700 p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                          disabled={inviteLoading[project._id]}
                        >
                          {inviteLoading[project._id] ? (
                            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-gray-700" />
                          ) : (
                            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;