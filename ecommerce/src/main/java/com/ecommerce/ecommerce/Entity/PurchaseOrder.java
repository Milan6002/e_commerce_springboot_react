package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity 
@Table(name = "PurchaseOrder")
public class PurchaseOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 2000)
    private String productName;
    private int quantity;
    private double price;
    private String supplierName;
}
