import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

// Helper to get auth from localStorage
const getInitialAuth = () => {
  try {
    const stored = localStorage.getItem('auth');
    return stored ? JSON.parse(stored) : { user: null, token: null };
  } catch {
    return { user: null, token: null };
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, _setAuth] = useState(getInitialAuth());

  // Wrap setAuth to also persist to localStorage
  const setAuth = (data) => {
    _setAuth(data);
    if (data && data.user && data.token) {
      localStorage.setItem('auth', JSON.stringify(data));
    } else {
      localStorage.removeItem('auth');
    }
  };

  return (
    <AuthContext.Provider value={{ ...auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
