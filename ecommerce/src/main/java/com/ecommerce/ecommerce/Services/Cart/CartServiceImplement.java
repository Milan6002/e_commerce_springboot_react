package com.ecommerce.ecommerce.Services.Cart;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ecommerce.ecommerce.Entity.CartEntity;
import com.ecommerce.ecommerce.Entity.CartItemEntity;
import com.ecommerce.ecommerce.Entity.ProductEntity;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Model.CartItemModel;
import com.ecommerce.ecommerce.Model.CartModel;
import com.ecommerce.ecommerce.Repository.CartItemRepository;
import com.ecommerce.ecommerce.Repository.CartRepository;
import com.ecommerce.ecommerce.Repository.ProductRepository;
import com.ecommerce.ecommerce.Repository.UserRepository;

@Service
public class CartServiceImplement implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ ADD TO CART
    @Override
    public CartModel addToCart(String userEmail, Long productId, int quantity) {

        User user = userRepository.findByEmail(userEmail);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        CartEntity cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setUser(user);
                    return cartRepository.save(newCart);
                });

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 🔥 FIX: check existing item
        Optional<CartItemEntity> existingItem = cart.getCartItems()
                .stream()
                .filter(i -> i.getProduct().getProduct_id().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItemEntity item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            cartItemRepository.save(item);
        } else {
            CartItemEntity item = new CartItemEntity();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

        return convertToDTO(cart);
    }

    // ✅ DTO CONVERTER
    private CartModel convertToDTO(CartEntity cart) {
        CartModel cartDTO = new CartModel();
        cartDTO.setId(cart.getId());
        cartDTO.setUserId(cart.getUser().getId());

        cartDTO.setCartItems(cart.getCartItems().stream().map(item -> {
            CartItemModel dto = new CartItemModel();
            dto.setId(item.getId()); // 🔥 IMPORTANT
            dto.setProductId(item.getProduct().getProduct_id());
            dto.setQuantity(item.getQuantity());
            return dto;
        }).toList());

        return cartDTO;
    }

    // ✅ GET CART ID
    @Override
    public CartModel getCartIdFromUserId(Long user_id) {

        User user = userRepository.findById(user_id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartEntity cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return convertToDTO(cart);
    }

    // ✅ GET CART ITEMS
    @Override
    public List<CartItemModel> getCartItemByCartId(Long cart_Id) {

        CartEntity cartEntity = cartRepository.findById(cart_Id)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        List<CartItemModel> cartItems = new ArrayList<>();

        for (CartItemEntity item : cartEntity.getCartItems()) {
            CartItemModel dto = new CartItemModel();
            dto.setId(item.getId()); // 🔥 IMPORTANT
            dto.setProductId(item.getProduct().getProduct_id());
            dto.setQuantity(item.getQuantity());
            cartItems.add(dto);
        }

        return cartItems;
    }

    // ✅ REMOVE ITEM
    @Override
    @Transactional
    public String removeItem(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
        return "Product removed from cart";
    }

    @Override
    @Transactional
    public void updateQuantity(Long cartItemId, int quantity) {

        CartItemEntity item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(quantity);
        cartItemRepository.save(item);
    }

}