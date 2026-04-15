import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

// React Context lets you share state (like "is the user logged in?")
// across ALL components without passing props down manually through every level.
// Think of it like a global variable that any component can subscribe to.

const AuthContext = createContext(null);

// AuthProvider wraps the entire app and provides login state everywhere
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { userId, username, role }
  const [loading, setLoading] = useState(true); // true while we check localStorage on startup

  // On app startup: check if there's already a token saved from a previous session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []); // [] = run only once when the component mounts

  const login = async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, userId, role } = response.data;

    // Persist to localStorage so the user stays logged in on refresh
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ userId, username, role }));
    setUser({ userId, username, role });
  };

  const register = async (username, email, password) => {
    await api.post('/auth/register', { username, email, password });
    // After registering, automatically log them in
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // The value prop makes these available to any component that calls useAuth()
  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — instead of writing useContext(AuthContext) everywhere,
// components just call useAuth()
export function useAuth() {
  return useContext(AuthContext);
}
