import axios from "axios";

const BASE_URL = "https://e-commerce-springboot-react-8i4i.onrender.com/api/supplier";

class SupplierService {
  createSupplier(payload) {
    return axios.post(BASE_URL, payload);
  }

  getSuppliers() {
    return axios.get(BASE_URL);
  }

  deleteSupplier(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  login(payload) {
    return axios.post(`${BASE_URL}/login`, payload);
  }

  getOrders() {
    return axios.get(`${BASE_URL}/orders`);
  }

  fulfillOrder(id) {
    return axios.put(`${BASE_URL}/fulfill/${id}`);
  }

  shipOrder(id) {
    return axios.put(`${BASE_URL}/ship/${id}`);
  }

  generateInvoice(orderId) {
    return axios.post(`${BASE_URL}/invoice/${orderId}`);
  }
}

export default new SupplierService();
