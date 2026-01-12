import api from './api';

export const authService = {
  async register(userData) {
    const response = await api.post('/register/', userData);
    return response.data;
  },

  async login(credentials) {
    const response = await api.post('/token/', credentials);
    const { access, refresh } = response.data;
    
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    return response.data;
  },

  async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/token/refresh/', {
      refresh: refreshToken,
    });
    
    const { access } = response.data;
    localStorage.setItem('accessToken', access);
    
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me/');
    return response.data;
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },
};