package com.ecommerce.ecommerce.Services.Cart;

import com.ecommerce.ecommerce.Model.CartModel;

public interface CartService {
	CartModel addToCart(Long userId, Long productId, int quantity);
}
