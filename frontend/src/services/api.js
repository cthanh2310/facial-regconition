import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const userAPI = {
  // Register a new user
  register: async (name, email, imageData) => {
    const response = await api.post('/api/register', {
      name,
      email,
      image_data: imageData
    });
    return response.data;
  },

  // Recognize a face
  recognize: async (imageData) => {
    const response = await api.post('/api/recognize', {
      image_data: imageData
    });
    return response.data;
  },

  // Get all users
  getUsers: async (skip = 0, limit = 100) => {
    const response = await api.get(`/api/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  // Get user by ID
  getUser: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  }
};

export default api;
