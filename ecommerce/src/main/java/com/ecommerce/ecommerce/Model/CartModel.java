package com.ecommerce.ecommerce.Model;

import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartModel {

    private Long id;
    private Long userId;
    private List<CartItemModel> cartItems;
}
