import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'; // Replace with your actual backend URL

export const login = async (credentials: { username: string; password: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};
