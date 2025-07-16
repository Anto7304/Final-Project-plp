import axios from 'axios';

const API = import.meta.env.VITE_API|| "http://localhost:5000/api";// Use env var or fallback

export const getPosts = async (token) => {
  return axios.get(`${API}/posts`, { headers: { Authorization: `Bearer ${token}` } });
};

export const getPost = async (id, token) => {
  return axios.get(`${API}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const createPost = async (data, token) => {
  return axios.post(`${API}/posts`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const updatePost = async (id, data, token) => {
  return axios.put(`${API}/posts/${id}`, data, { headers: { Authorization: `Bearer ${token}` } });
};

export const deletePost = async (id, token) => {
  if (!token || typeof token !== 'string' || token.length < 10) {
    throw new Error('Missing or invalid authentication token. Please log in again.');
  }
  return axios.delete(`${API}/posts/${id}`, { headers: { Authorization: `Bearer ${token}` } });
};

export const flagPost = async (id, token) => {
  return axios.patch(`${API}/posts/${id}/flag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const unflagPost = async (id, token) => {
  return axios.patch(`${API}/posts/${id}/unflag`, {}, { headers: { Authorization: `Bearer ${token}` } });
};

export const getFlaggedPosts = async (token) => {
  return axios.get(`${API}/flagged-posts`, { headers: { Authorization: `Bearer ${token}` } });
};
