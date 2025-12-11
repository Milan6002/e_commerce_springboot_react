package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;
    
    @Lob
    private byte[] img; 

    private String role; // e.g., ROLE_USER, ROLE_ADMIN
}