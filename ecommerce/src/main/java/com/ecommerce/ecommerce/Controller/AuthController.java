package com.ecommerce.ecommerce.Controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Model.LoginModel;
import com.ecommerce.ecommerce.Model.ProfileModel;
import com.ecommerce.ecommerce.Model.UserModel;
import com.ecommerce.ecommerce.Services.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    
    @Autowired
    AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@ModelAttribute UserModel userModel,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(authService.register(userModel, image));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginModel loginModel) {
        return ResponseEntity.ok(authService.login(loginModel));
    }

    @GetMapping("/profile/{email}")
    public ProfileModel profile(@PathVariable String email) {
        return authService.getuserprofile(email);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> Updateprofile(@PathVariable Long id, @ModelAttribute ProfileModel profileModel,
            @RequestParam("image") MultipartFile image) throws IOException {
        return ResponseEntity.ok(authService.Updateprofile(id, profileModel, image));
    }
}
