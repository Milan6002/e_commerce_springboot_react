package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    private Long id;

    private String firstname;
    private String lastname;

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

    private byte[] img;

    private String role;
    private Boolean active;
}