import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8005';

export const getHealth = async () => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};

export const getMetrics = async () => {
  const response = await axios.get(`${API_BASE_URL}/metrics`);
  return response.data;
};

export const predictTransaction = async (features) => {
  const response = await axios.post(`${API_BASE_URL}/predict`, { features });
  return response.data;
};