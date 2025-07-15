import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Register from '../components/Auth/Register';
import { AuthContext } from '../context/AuthContext';

const AuthPages = () => {
  const location = useLocation();
  const queryTab = new URLSearchParams(location.search).get('tab');
  const [showLogin, setShowLogin] = useState(queryTab !== 'register');
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      navigate('/'); // Redirect to home if logged in
    }
  }, [user, token, navigate]);

  // Update tab if query changes
  useEffect(() => {
    setShowLogin(queryTab !== 'register');
  }, [queryTab]);

  if (user && token) return null; // Optionally, show a spinner or nothing while redirecting

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-lg rounded-lg p-8">
      <div className="flex justify-center mb-6 gap-4" role="tablist" aria-label="Authentication tabs">
        <button
          onClick={() => setShowLogin(true)}
          className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${showLogin ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
          role="tab"
          aria-selected={showLogin}
          aria-controls="login-panel"
          id="login-tab"
          tabIndex={0}
        >
          Login
        </button>
        <button
          onClick={() => setShowLogin(false)}
          className={`px-4 py-2 rounded-t-lg font-semibold transition border-b-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${!showLogin ? 'border-blue-500 text-blue-700' : 'border-transparent text-gray-500 hover:text-blue-500'}`}
          role="tab"
          aria-selected={!showLogin}
          aria-controls="register-panel"
          id="register-tab"
          tabIndex={0}
        >
          Register
        </button>
      </div>
      <div
        role="tabpanel"
        id="login-panel"
        aria-labelledby="login-tab"
        hidden={!showLogin}
      >
        {showLogin ? <Login /> : null}
      </div>
      <div
        role="tabpanel"
        id="register-panel"
        aria-labelledby="register-tab"
        hidden={showLogin}
      >
        {!showLogin ? <Register /> : null}
      </div>
    </div>
  );
};

export default AuthPages;
