package com.ecommerce.ecommerce.Services.Cart;

import java.util.List;

import com.ecommerce.ecommerce.Model.CartItemModel;
import com.ecommerce.ecommerce.Model.CartModel;

public interface CartService {
	CartModel addToCart(String userEmail, Long productId, int quantity);
	CartModel getCartIdFromUserId(Long user_id);
	List<CartItemModel> getCartItemByCartId(Long cart_Id);
	String removeItem(Long product_id);
}
