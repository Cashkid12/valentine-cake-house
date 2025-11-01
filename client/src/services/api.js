import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData - let browser handle it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Cakes API
export const cakesAPI = {
  getAll: () => api.get('/cakes'),
  getFeatured: () => api.get('/cakes?featured=true'),
  getById: (id) => api.get(`/cakes/${id}`),
  create: (cakeData) => {
    // For FormData, don't set Content-Type
    if (cakeData instanceof FormData) {
      return api.post('/admin/cakes', cakeData, {
        headers: {
          'Content-Type': undefined // Let browser set it
        }
      });
    }
    // For regular JSON data
    return api.post('/admin/cakes', cakeData);
  },
  update: (id, cakeData) => api.put(`/admin/cakes/${id}`, cakeData),
  delete: (id) => api.delete(`/admin/cakes/${id}`),
};

// Admin API
export const adminAPI = {
  // Cake management
  createCake: (cakeData) => {
    if (cakeData instanceof FormData) {
      return api.post('/admin/cakes', cakeData, {
        headers: {
          'Content-Type': undefined
        }
      });
    }
    return api.post('/admin/cakes', cakeData);
  },
  updateCake: (id, cakeData) => api.put(`/admin/cakes/${id}`, cakeData),
  deleteCake: (id) => api.delete(`/admin/cakes/${id}`),
  
  // Order management
  getOrders: () => api.get('/admin/orders'),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  
  // Custom requests management
  getCustomRequests: () => api.get('/admin/custom-requests'),
  updateRequestStatus: (id, status) => api.patch(`/admin/custom-requests/${id}/status`, { status }),
  
  // Analytics
  getStats: () => api.get('/admin/stats'),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
};

// Custom Cakes API
export const customCakesAPI = {
  create: (requestData) => {
    if (requestData instanceof FormData) {
      return api.post('/custom-cakes', requestData, {
        headers: {
          'Content-Type': undefined
        }
      });
    }
    return api.post('/custom-cakes', requestData);
  },
  getAll: () => api.get('/custom-cakes'),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

export default api;