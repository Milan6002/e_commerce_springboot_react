import axios from "axios";

const BASE_URL = "https://e-commerce-springboot-react-8i4i.onrender.com/api/auth/cart/";

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
  updateCartItemQuantity(cartItemId, quantity) {
  return axios.put(BASE_URL + "updateQuantity", null, {
    params: { cartItemId, quantity },
  });
}
}

export default new CartService();
