import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Added /api prefix

export const getComments = async (postId, token) => {
  return axios.get(`${API_URL}/comments/${postId}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const addComment = async (data, token) => {
  return axios.post(`${API_URL}/comments`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const updateComment = async (id, data, token) => {
  return axios.put(`${API_URL}/comments/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deleteComment = async (id, token) => {
  return axios.delete(`${API_URL}/comments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const toggleLike = async (id, token) => {
  return axios.patch(`${API_URL}/comments/${id}/toggle-like`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const flagComment = async (id, token) => {
  return axios.patch(`${API_URL}/comments/${id}/flag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const unflagComment = async (id, token) => {
  return axios.patch(`${API_URL}/comments/${id}/unflag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const getFlaggedComments = async (token) => {
  return axios.get(`${API_URL}/flagged-comments`, { headers: { Authorization: `Bearer ${token}` } });
};
