import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const response = await api.get('/products/', { params });
    return response.data;
  },

  async getProduct(id) {
    const response = await api.get(`/products/${id}/`);
    return response.data;
  },

  async getFeaturedProducts() {
    const response = await api.get('/products/featured/');
    return response.data;
  },

  async getProductReviews(productId) {
    const response = await api.get(`/products/${productId}/reviews/`);
    return response.data;
  },

  async getCategories() {
    const response = await api.get('/categories/');
    return response.data;
  },
};