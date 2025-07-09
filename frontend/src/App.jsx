import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProjectProvider } from './context/ProjectContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <ProjectProvider>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor/:id" element={<Editor />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </ProjectProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;