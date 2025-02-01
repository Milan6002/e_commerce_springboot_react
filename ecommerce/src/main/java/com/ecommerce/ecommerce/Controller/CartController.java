package com.ecommerce.ecommerce.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import com.ecommerce.ecommerce.Model.CartModel;
import com.ecommerce.ecommerce.Services.Cart.CartService;

@RestController
@RequestMapping("/api/auth/cart")
@CrossOrigin("http://localhost:5173")
public class CartController {

    @Autowired
    CartService cartService;

    @PostMapping("/add")
    public CartModel addToCart(@RequestParam Long userId, @RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addToCart(userId, productId, quantity);
    }
}
