import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Use env var or fallback

export const getMe = async (token) => {
  return axios.get(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateProfile = async (id, data, token) => {
  return axios.put(`${API_URL}/user/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteAccount = async (id, token) => {
  return axios.delete(`${API_URL}/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAllUsers = async (token) => {
  return axios.get(`${API_URL}/All`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateUserRole = async (id, role, token) => {
  return axios.put(`${API_URL}/role/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateUserStatus = async (id, status, token) => {
  return axios.patch(`${API_URL}/status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

export const resetUserPassword = async (id, password, token) => {
  return axios.patch(`${API_URL}/reset-password/${id}`, { password }, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAuditLogs = async (token) => {
  return axios.get(`${API_URL}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
};

export const clearAuditLogs = async (token) => {
  return axios.delete(`${API_URL}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
};
