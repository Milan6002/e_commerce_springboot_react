package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "cart_item")
public class CartItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer quantity;

    // ✅ ADD THIS (IMPORTANT)
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductEntity product;

    // ✅ Cart relation
    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonIgnore
    private CartEntity cart;
}