package com.ecommerce.ecommerce.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Model.CartItemModel;
import com.ecommerce.ecommerce.Model.CartModel;
import com.ecommerce.ecommerce.Services.Cart.CartService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/auth/cart")
@CrossOrigin("http://localhost:5173")
public class CartController {

    @Autowired
    CartService cartService;

    @PostMapping("/add")
    public CartModel addToCart(@RequestParam String userEmail, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addToCart(userEmail, productId, quantity);
    }

    @GetMapping("/cartId/{user_id}")
    public CartModel getMethodName(@PathVariable Long user_id) {
        return cartService.getCartIdFromUserId(user_id);
    }
    
    @GetMapping("/cartItem/{cart_id}")
    public List<CartItemModel> getCartItemFromCartId(@PathVariable Long cart_id) {
        return cartService.getCartItemByCartId(cart_id);
    }

    @DeleteMapping("/deleteCartItem/{product_id}")
    public String removeCartItem(@PathVariable Long product_id){
        return cartService.removeItem(product_id);
    }
    
}
