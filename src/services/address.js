// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// const getAuthHeader = () => {
//   const token = localStorage.getItem('access_token');
//   return token ? { Authorization: `Bearer ${token}` } : {};
// };

// export const getAddresses = async (id) => {
//   const response = await axios.get(`${API_URL}/api/addresses/${id}`, {
//     headers: getAuthHeader()
//   });
//   return response.data;
// };

// export const createAddress = async (addressData) => {
//   const response = await axios.post(`${API_URL}/api/addresses/`, addressData, {
//     headers: getAuthHeader()
//   });
//   return response.data;
// };

// export const updateAddress = async (id, addressData) => {
//   const response = await axios.put(`${API_URL}/api/addresses/${id}/`, addressData, {
//     headers: getAuthHeader()
//   });
//   return response.data;
// };

// export const deleteAddress = async (id) => {
//   const response = await axios.delete(`${API_URL}/api/addresses/${id}/`, {
//     headers: getAuthHeader()
//   });
//   return response.data;
// };


import api from "./api";

export const addressService = {
  async getAddresses() {
    const response = await api.get("/addresses/");
    return response.data;
  },

  async createAddress(addressData) {
    const response = await api.post(`/addresses/`, addressData);
    return response.data;
  },

  async updateAddress(id, addressData) {
    const response = await api.put(`/addresses/${id}/`, addressData);
    return response.data;
  },

  async deleteAddress(id) {
    const response = await api.delete(`/addresses/${id}/`);
    return response.data;
  },
};
