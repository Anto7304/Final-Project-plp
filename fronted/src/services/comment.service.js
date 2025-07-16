import axios from 'axios';

const API = import.meta.env.VITE_API || 'http://localhost:5000/api'; // Use env var or fallback

export const getComments = async (postId, token) => {
  return axios.get(`${API}/comments/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const addComment = async (data, token) => {
  return axios.post(`${API}/comments`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateComment = async (id, data, token) => {
  return axios.put(`${API}/comments/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteComment = async (id, token) => {
  return axios.delete(`${API}/comments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const toggleLike = async (id, token) => {
  return axios.patch(`${API}/comments/${id}/toggle-like`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const flagComment = async (id, token) => {
  return axios.patch(`${API}/comments/${id}/flag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const unflagComment = async (id, token) => {
  return axios.patch(`${API}/comments/${id}/unflag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const getFlaggedComments = async (token) => {
  return axios.get(`${API}/flagged-comments`, { headers: { Authorization: `Bearer ${token}` } });
};
