package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Data
@Table(name = "Payment")
public class PaymentEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double amount;
    private String paymentMethod; // COD
    private String status; // PENDING / SUCCESS
    private Long orderId;
    private String userEmail;

    // getters setters
}
