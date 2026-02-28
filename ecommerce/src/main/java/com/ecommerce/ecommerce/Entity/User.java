package com.ecommerce.ecommerce.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Personal
    private String firstName;
    private String lastName;

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

}