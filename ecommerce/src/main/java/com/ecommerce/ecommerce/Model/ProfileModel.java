package com.ecommerce.ecommerce.Model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileModel {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private byte[] img;
    private String role;
    private String mobile;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String gender;
    private String dob;


    // public Long getId() {
    //     return id;
    // }

    // public void setId(Long id) {
    //     this.id = id;
    // }

    // public String getName() {
    //     return first_name + " " + last_name;
    // }

    // public void setName(String name) {
    //     String[] parts = name.split(" ", 2);
    //     this.first_name = parts[0];
    //     this.last_name = parts.length > 1 ? parts[1] : "";
    // }

    // public String getEmail() {
    //     return email;
    // }

    // public void setEmail(String email) {
    //     this.email = email;
    // }

    // public byte[] getImg() {
    //     return img;
    // }

    // public void setImg(byte[] img) {
    //     this.img = img;
    // }

    // public String getRole() {
    //     return role;
    // }

    // public void setRole(String role) {
    //     this.role = role;
    // }
}

