import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await api.post('/auth/register', { username, email, password });
      setUser(response.data.user);
      navigate('/dashboard');
    } catch (error) {
      throw error.response.data.error;
    }
  };

  const logout = async () => {
    await api.get('/auth/logout');
    setUser(null);
    navigate('/login');
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setUser(response.data);
    } catch (error) {
      setUser(null);
      // navigate('/login');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};