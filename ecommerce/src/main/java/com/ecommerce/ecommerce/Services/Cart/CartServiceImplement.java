package com.ecommerce.ecommerce.Services.Cart;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.ecommerce.Entity.CartEntity;
import com.ecommerce.ecommerce.Entity.CartItemEntity;
import com.ecommerce.ecommerce.Entity.CartItemRepository;
import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Model.CartItemModel;
import com.ecommerce.ecommerce.Model.CartModel;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartServiceImplement implements CartService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    CartItemRepository cartItemRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    UserRepository userRepository;

    @Override
    public CartModel addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartEntity cart = cartRepository.findByUser(user).orElseGet(() -> {
            CartEntity newCart = new CartEntity();
            newCart.setUser(user);
            newCart.setCartItems(new ArrayList<>()); // 🔹 Ensure list is initialized
            return cartRepository.save(newCart);
        });

        Optional<CartItemEntity> existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getProduct_id().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + quantity);
        } else {
            CartItemEntity newItem = new CartItemEntity();
            newItem.setCart(cart); // 🔹 Set cart reference
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cart.getCartItems().add(newItem);
        }

        cartRepository.save(cart); // 🔹 Persist the cart with the updated list

        return convertToDTO(cart);
    }

    private CartModel convertToDTO(CartEntity cart) {
        CartModel cartDTO = new CartModel();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());
        cartDTO.setCartItems(cart.getCartItems().stream().map(item -> {
            CartItemModel cartItemDTO = new CartItemModel();
            cartItemDTO.setProductId(item.getProduct().getProduct_id());
            cartItemDTO.setQuantity(item.getQuantity());
            return cartItemDTO;
        }).toList());
        return cartDTO;
    }
}


