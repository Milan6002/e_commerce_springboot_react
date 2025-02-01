package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserModel {

    private Long id;
    private String name;
    private String email;
    private String password;
    private byte[] img;
    private String role; // e.g., ROLE_USER, ROLE_ADMIN
}
