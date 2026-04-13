import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
};

export const jobseekerService = {
  getProfile: () => api.get('/jobseeker/profile'),
  updateProfile: (data) => api.put('/jobseeker/profile', data),
  uploadFile: (formData) => api.post('/jobseeker/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const employerService = {
  getProfile: () => api.get('/employer/profile'),
  searchJobseekers: (params) => api.get('/employer/jobseekers', { params }),
  viewJobseeker: (id) => api.get(`/employer/jobseekers/${id}`),
  contactJobseeker: (id, message) => api.post(`/employer/contact/${id}`, { message }),
};

export const paymentService = {
  initMpesa: (phone) => api.post('/payments/mpesa', { phone }),
  checkStatus: (transactionId) => api.get(`/payments/status/${transactionId}`),
};

export default api;