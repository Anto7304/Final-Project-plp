import axios from 'axios';

const API = import.meta.env.VITE_API|| "http://localhost:5000/api"

export const register = async (data) => {
  return axios.post(`${API}/signup`, data);
};

export const login = async (data) => {
  return axios.post(`${API}/login`, data);
};
