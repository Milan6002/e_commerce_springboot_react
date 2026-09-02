import axios from "axios";

const BASE_URL = "http://localhost:8081/api/warehouse";

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
