import api from './api';

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders/');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}/`);
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.patch(`/orders/${id}/cancel/`);
    return response.data;
  },
};