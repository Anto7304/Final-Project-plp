import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <Navbar />
    <main id="main-content" className="container mx-auto px-4 py-6" tabIndex={-1} aria-label="Main content">{children}</main>
  </div>
);

export default Layout;
