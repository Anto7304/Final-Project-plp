import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Use env var or fallback

export const getPosts = async (token) => {
  return axios.get(`${API_URL}/posts`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getPost = async (id, token) => {
  return axios.get(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const createPost = async (data, token) => {
  return axios.post(`${API_URL}/posts`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const updatePost = async (id, data, token) => {
  return axios.put(`${API_URL}/posts/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deletePost = async (id, token) => {
  return axios.delete(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const flagPost = async (id, token) => {
  return axios.patch(`${API_URL}/posts/${id}/flag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const unflagPost = async (id, token) => {
  return axios.patch(`${API_URL}/posts/${id}/unflag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const getFlaggedPosts = async (token) => {
  return axios.get(`${API_URL}/flagged-posts`, { headers: { Authorization: `Bearer ${token}` } });
};
