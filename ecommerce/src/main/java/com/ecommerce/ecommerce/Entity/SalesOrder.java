package com.ecommerce.ecommerce.Entity;

import lombok.Data;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "SalesOrder")
@Data
public class SalesOrder {

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String customerEmail;
    
    @Column(length = 2000)
    private String productName;
    private int quantity;
    private double price;
    private double totalAmount;

    private String paymentMethod;

    // ✅ ADD THIS
    private String paymentStatus = "PENDING"; // PENDING / SUCCESS

    private String status = "Pending"; // Pending / Delivered

    private LocalDateTime orderDate = LocalDateTime.now();
}