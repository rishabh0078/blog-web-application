import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
