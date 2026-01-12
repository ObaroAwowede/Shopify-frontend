import api from './api';

export const cartService = {
  async getCart() {
    const response = await api.get('/cart/my_cart/');
    return response.data;
  },

  async addItem(productId, quantity = 1) {
    const response = await api.post('/cart/add_item/', {
      product_id: productId,
      quantity,
    });
    return response.data;
  },

  async updateItem(itemId, quantity) {
    const response = await api.patch(`/cart/update_item/`, {
      item_id: itemId,
      quantity,
    });
    return response.data;
  },

  async removeItem(itemId) {
    const response = await api.delete(`/cart/remove_item/`, {
      data: { item_id: itemId },
    });
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear/');
    return response.data;
  },

  async checkout() {
    const response = await api.post('/cart/checkout/');
    return response.data;
  },
};