package com.ecommerce.ecommerce.Model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String mobile;
    private String password;

    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;

    private String gender;
    private String dob;

    @Lob
    @Column(columnDefinition = "VARBINARY(MAX)")
    private byte[] img;

    private String role;
    private Boolean active;
}