package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemModel {

    private Long id;          // 🔥 VERY IMPORTANT
    private Long productId;
    private int quantity;
}