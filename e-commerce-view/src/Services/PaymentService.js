import axios from "axios";

const BASE_URL = "https://e-commerce-springboot-react-8i4i.onrender.com/api/payment";

class PaymentService {
  createPayment(payload) {
    return axios.post(BASE_URL, payload);
  }

  getAllPayments() {
    return axios.get(BASE_URL);
  }

  getPaymentsByUser(email) {
    return axios.get(`${BASE_URL}/user/${email}`);
  }

  updatePaymentStatus(id, status) {
    return axios.put(`${BASE_URL}/status/${id}?status=${status}`);
  }

  deletePayment(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }
}

export default new PaymentService();
