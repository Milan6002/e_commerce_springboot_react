package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoice")
@Data
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Order reference
    private Long orderId;

    // 👤 Customer
    private String customerName;

    // 📦 Product details
    @Column(length = 2000)
    private String productName;
    private int quantity;
    private double price;

    // 💰 Total
    private double totalAmount;

    // 💳 Payment
    private String paymentMethod;

    // 🧾 Invoice Info
    private String invoiceNumber;
    private LocalDateTime invoiceDate;
    private String paymentStatus;
}