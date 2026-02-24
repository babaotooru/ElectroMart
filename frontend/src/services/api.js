import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api';

const api = axios.create({ baseURL: BASE_URL });

// Attach token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('em_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Auth ──────────────────────────────────────────
export const registerUser  = data => api.post('/auth/register', data);
export const loginUser     = data => api.post('/auth/login', data);
export const registerAdmin = data => api.post('/auth/admin/register', data);
export const loginAdmin    = data => api.post('/auth/admin/login', data);

// ─── Products ──────────────────────────────────────
export const getProducts    = (page = 0, size = 8) => api.get(`/products?page=${page}&size=${size}`);
export const getProductById = id => api.get(`/products/${id}`);
export const searchProducts = q  => api.get(`/products/search?q=${q}`);
export const getCategories  = () => api.get('/products/categories');
export const getByCategory  = cat => api.get(`/products?category=${cat}`);

// Admin product ops
export const addProduct    = data => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = id => api.delete(`/products/${id}`);

// ─── Cart ──────────────────────────────────────────
export const getCart       = userId => api.get(`/cart/${userId}`);
export const addToCart     = data   => api.post('/cart', data);
export const updateCartQty = (cartItemId, qty) => api.put(`/cart/${cartItemId}`, { quantity: qty });
export const removeFromCart = cartItemId => api.delete(`/cart/${cartItemId}`);

// ─── Profile ───────────────────────────────────────
export const getUserProfile    = userId => api.get(`/users/${userId}`);
export const updateUserProfile = (userId, data) => api.put(`/users/${userId}`, data);

export default api;
