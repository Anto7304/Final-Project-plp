import axios from 'axios';

const API = import.meta.env.VITE_API || "http://localhost:5000/api";

export const getMe = async (token) => {
  return axios.get(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateProfile = async (id, data, token) => {
  return axios.put(`${API}/user/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteAccount = async (id, token) => {
  return axios.delete(`${API}/user/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAllUsers = async (token) => {
  return axios.get(`${API}/All`, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateUserRole = async (id, role, token) => {
  return axios.put(`${API}/role/${id}`, { role }, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateUserStatus = async (id, status, token) => {
  return axios.patch(`${API}/status/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
};

export const resetUserPassword = async (id, password, token) => {
  return axios.patch(`${API}/reset-password/${id}`, { password }, { headers: { Authorization: `Bearer ${token}` } });
};

export const getAuditLogs = async (token) => {
  return axios.get(`${API}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
};

export const clearAuditLogs = async (token) => {
  return axios.delete(`${API}/audit-logs`, { headers: { Authorization: `Bearer ${token}` } });
};
