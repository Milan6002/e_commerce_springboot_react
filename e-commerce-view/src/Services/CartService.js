import axios from "axios";

const BASE_URL = "http://192.168.1.11:8080/api/auth/cart/";

class CartService{

    addToCart(userEmail, productId, quantity){
        return axios.post(BASE_URL+"add", null, {
            params: { userEmail, productId, quantity }
        });
    };


    getCartID(user_id){
        return axios.get(BASE_URL+"cartId/"+user_id);
    }

    getCartItems(cart_id){
        return axios.get(BASE_URL+"cartItem/"+cart_id);
    }
}

export default new CartService();