package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table
public class CartItemEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "cart_id", nullable = false)
  @JsonIgnore
  private CartEntity cart; // 🔹 Ensure cart is set

  @ManyToOne
  @JoinColumn(name = "product_id", nullable = false)
  private ProductEntity product;

  private int quantity;
}

