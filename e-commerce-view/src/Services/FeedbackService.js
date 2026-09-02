import axios from "axios";

const BASE_URL = "https://e-commerce-springboot-react-8i4i.onrender.com/api/feedback";

class FeedbackService {
  addFeedback(payload) {
    return axios.post(BASE_URL, payload);
  }

  getAllFeedbacks() {
    return axios.get(BASE_URL);
  }

  updateFeedbackStatus(id, status) {
    return axios.put(`${BASE_URL}/status/${id}?status=${status}`);
  }

  deleteFeedback(id) {
    return axios.delete(`${BASE_URL}/${id}`);
  }

  analyzeFeedback() {
    return axios.get("https://e-commerce-springboot-react-8i4i.onrender.com/api/ai/analyze-feedback");
  }
}

export default new FeedbackService();
