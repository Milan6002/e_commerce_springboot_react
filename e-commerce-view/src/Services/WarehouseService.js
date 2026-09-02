import axios from "axios";

const BASE_URL = "https://e-commerce-springboot-react-8i4i.onrender.com/api/warehouse";

class WarehouseService {
  getAllStocks() {
    return axios.get(`${BASE_URL}/stocks`);
  }

  getStockByProductId(productId) {
    return axios.get(`${BASE_URL}/stock/${productId}`);
  }

  updateStock(productId, quantity) {
    return axios.put(`${BASE_URL}/stock/update`, { productId, quantity });
  }

  deliverStock(productId, quantity) {
    return axios.put(`${BASE_URL}/stock/deliver`, { productId, quantity });
  }
}

export default new WarehouseService();
