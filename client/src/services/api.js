import axios from 'axios';

// Use environment variable for production, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
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
    } else {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
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
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
  
  // Custom requests management
  getCustomRequests: (params = {}) => api.get('/admin/custom-requests', { params }),
  updateRequestStatus: (id, status, adminNotes) => api.patch(`/admin/custom-requests/${id}/status`, { status, adminNotes }),
  
  // Analytics
  getStats: () => api.get('/admin/stats'),
  
  // User management
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, userData) => api.patch(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
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
  getById: (id) => api.get(`/custom-cakes/${id}`),
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.patch('/auth/profile', userData),
};

// Health check
export const healthAPI = {
  check: () => api.get('/health')
};

// Utility function to check API connectivity
export const checkAPIConnectivity = async () => {
  try {
    const response = await healthAPI.check();
    return {
      connected: true,
      status: response.data.status,
      environment: response.data.environment
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
};

export default api;
