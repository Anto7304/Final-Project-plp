import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Added /api prefix

export const register = async (data) => {
  return axios.post(`${API_URL}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API_URL}/login`, data);
};
