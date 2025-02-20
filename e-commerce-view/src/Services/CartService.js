import axios from "axios";

const BASE_URL = "http://192.168.1.16:8080/ecommerce/api/auth/cart/";

class CartService {
  addToCart(userEmail, productId, quantity) {
    return axios.post(BASE_URL + "add", null, {
      params: { userEmail, productId, quantity },
    });
  }

  getCartID(user_id) {
    return axios.get(BASE_URL + "cartId/" + user_id);
  }

  getCartItems(cart_id) {
    return axios.get(BASE_URL + "cartItem/" + cart_id);
  }

  removeItem(product_id) {
    return axios.delete(BASE_URL + "deleteCartItem/" + product_id);
  }
}

export default new CartService();
