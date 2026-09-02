package com.ecommerce.ecommerce.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.ecommerce.Model.CartItemModel;
import com.ecommerce.ecommerce.Model.CartModel;
import com.ecommerce.ecommerce.Services.Cart.CartService;

@RestController
@RequestMapping("/api/auth/cart")
@CrossOrigin("*")
public class CartController {

    @Autowired
    CartService cartService;

    // ADD PRODUCT TO CART
    @PostMapping("/add")
    public CartModel addToCart(@RequestParam String userEmail,
            @RequestParam Long productId,
            @RequestParam int quantity) {

        return cartService.addToCart(userEmail, productId, quantity);
    }

    // GET CART ID BY USER
    @GetMapping("/cartId/{user_id}")
    public CartModel getCartId(@PathVariable Long user_id) {
        return cartService.getCartIdFromUserId(user_id);
    }

    // GET CART ITEMS
    @GetMapping("/cartItem/{cart_id}")
    public List<CartItemModel> getCartItemFromCartId(@PathVariable Long cart_id) {
        return cartService.getCartItemByCartId(cart_id);
    }

    // DELETE CART ITEM
    @DeleteMapping("/deleteCartItem/{cartItemId}")
    public String removeCartItem(@PathVariable Long cartItemId) {
        return cartService.removeItem(cartItemId);
    }

    @PutMapping("/updateQuantity")
    public String updateQuantity(@RequestParam Long cartItemId,
            @RequestParam int quantity) {

        cartService.updateQuantity(cartItemId, quantity);
        return "Quantity updated";
    }
}