import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, setAuth } = useContext(AuthContext);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dark]);

  const handleLogout = () => {
    setAuth({ user: null, token: null });
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only absolute left-2 top-2 bg-blue-500 text-white px-3 py-1 rounded z-50">Skip to main content</a>
      <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-3 flex items-center justify-between mb-6 transition-colors duration-300" role="navigation" aria-label="Main navigation">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" tabIndex={0}>Home</Link>
          <Link to="/posts" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" tabIndex={0}>Posts</Link>
          <Link to="/profile" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" tabIndex={0}>Profile</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" tabIndex={0}>Admin</Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setDark((d) => !d)}
            className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={dark}
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {user ? (
            <>
              <span className="text-gray-600 dark:text-gray-200">Welcome, <span className="font-semibold">{user.userName}</span></span>
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0}>Login/Register</Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
