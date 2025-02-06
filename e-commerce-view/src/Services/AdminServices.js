import axios from "axios";

const BASE_URL = "http://192.168.1.11:8080/api/auth/";

class AdminServices {
  //Category Related Services
  addCategory(categoryData) {
    return axios.post(BASE_URL + "addCategory", categoryData);
  }

  getAllCategories() {
    return axios.get(BASE_URL + "getCategory");
  }

  deleteCategory(category_id) {
    return axios.delete(BASE_URL + "deleteCategory/" + category_id);
  }

  getCategoryById(category_id) {
    return axios.get(BASE_URL + "getCategoryById/" + category_id);
  }

  updateCategory(category_id, categoryData) {
    return axios.put(BASE_URL + "updateCategory/" + category_id, categoryData);
  }

  //Product Related Services
  addProduct(productData) {
    return axios.post(BASE_URL + "addProduct", productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getAllProducts() {
    return axios.get(BASE_URL + "getAllProduct");
  }

  getProductById(product_id) {
    return axios.get(BASE_URL + "getProductById/" + product_id);
  }

  deleteProduct(product_id) {
    return axios.delete(BASE_URL + "deleteProduct/" + product_id);
  }

  updateProduct(productData, product_id) {
    return axios.put(BASE_URL + "updateProduct/" + product_id, productData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  getProductByCategory(category_id){
    return axios.get(BASE_URL+"getProductByCategory/"+category_id);
  }
}

export default new AdminServices();
