package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal
    private String firstname;
    private String lastname;
    private String email;
    private String mobile;
    private String password;

    // Address
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;

    // Profile
    private String gender;
    private String dob;

    @Lob
    private byte[] img;

    private String role;
    private Boolean active = true;

    // ✅ One User → One Cart
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private CartEntity cart;
}