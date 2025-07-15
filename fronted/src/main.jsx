import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import HomePages from './pages/HomePages';
import PostPages from './pages/PostPages';
import ProfilePage from './pages/ProfilePage';
import AuthPages from './pages/AuthPages';
import AdminPage from './pages/AdminPage';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePages />} />
            <Route path="/posts" element={<PostPages />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/auth" element={<AuthPages />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
