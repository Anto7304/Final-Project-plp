import React from 'react';
import { Link } from 'react-router-dom';

const HomePages = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 className="text-4xl font-bold mb-4 text-blue-700" id="home-main-heading">Welcome to the Blog App</h1>
    <nav className="mb-6 flex gap-4" aria-label="Home navigation">
      <Link to="/posts" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0}>Posts</Link>
      <Link to="/profile" className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-400" tabIndex={0}>Profile</Link>
    </nav>
    <p className="text-gray-600 text-lg text-center max-w-xl">This is a simple blog platform. Use the navigation above to explore posts or manage your profile.</p>
  </div>
);

export default HomePages;
