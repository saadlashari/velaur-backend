import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velaur_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Products
export const getProducts = (params = {}) => api.get('/products/', { params });
export const getProduct = (slug) => api.get(`/products/${slug}/`);
export const getFeaturedProducts = () => api.get('/products/featured/');
export const getCategories = () => api.get('/products/categories/');

// Orders
export const createOrder = (data) => api.post('/orders/', data);
export const getMyOrders = () => api.get('/orders/my-orders/');
export const getOrderDetail = (id) => api.get(`/orders/${id}/`);

// Payments
export const getPaymentInfo = () => api.get('/payments/info/');
export const submitPayment = (formData) => api.post('/payments/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

// Users
export const register = (data) => api.post('/users/register/', data);
export const login = (data) => api.post('/users/login/', data);
export const getProfile = () => api.get('/users/profile/');
export const updateProfile = (data) => api.patch('/users/profile/', data);

// Contact
export const sendContact = (data) => api.post('/contact/', data);

// Chatbot
export const sendChatMessage = (data) => api.post('/chatbot/', data);

export default api;