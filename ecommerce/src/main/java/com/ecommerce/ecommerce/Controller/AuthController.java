package com.ecommerce.ecommerce.Controller;

import java.io.IOException;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Entity.OtpEntity;
import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Model.LoginModel;
import com.ecommerce.ecommerce.Model.ProfileModel;
import com.ecommerce.ecommerce.Model.UserModel;
import com.ecommerce.ecommerce.Repository.OtpRepo;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Services.AuthService;
import com.ecommerce.ecommerce.Services.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private OtpRepo otpRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @ModelAttribute UserModel userModel,
            @RequestParam(required = false) MultipartFile image)
            throws IOException {

        return ResponseEntity.ok(
                authService.register(userModel, image));
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginModel loginModel) {

        return ResponseEntity.ok(
                authService.login(loginModel));
    }

    // GOOGLE LOGIN
    @PostMapping("/google")
    public ResponseEntity<String> googleLogin(
            @RequestBody com.ecommerce.ecommerce.Model.GoogleLoginModel googleLoginModel) {

        return ResponseEntity.ok(
                authService.googleLogin(googleLoginModel));
    }

    // PROFILE
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> profile(
            @PathVariable String email) {

        try {
            return ResponseEntity.ok(
                    authService.getuserprofile(email));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(e.getMessage());
        }
    }

    // UPDATE PROFILE
    @PutMapping("/update/{id}")
    public String updateProfile(
            @PathVariable Long id,
            @ModelAttribute ProfileModel profileModel,
            @RequestParam(value = "image", required = false) MultipartFile image)
            throws IOException {

        return authService.updateProfile(
                id,
                profileModel,
                image);
    }

    // GET ALL USERS
    @GetMapping("/admin/users")
    public ResponseEntity<?> getAllUsers() {

        return ResponseEntity.ok(
                authService.getAllUsers());
    }

    // ACTIVATE / DEACTIVATE USER
    @PutMapping("/admin/user/status/{id}")
    public ResponseEntity<String> updateUserStatus(
            @PathVariable Long id,
            @RequestParam Boolean active) {

        return ResponseEntity.ok(
                authService.updateUserStatus(id, active));
    }

    // SEND OTP
    @PostMapping("/send-otp")
    public String sendOtp(
            @RequestParam String email) {

        String otp = String.valueOf(
                (int) (Math.random() * 9000) + 1000);

        OtpEntity entity = new OtpEntity();

        entity.setEmail(email);
        entity.setOtp(otp);
        entity.setExpiryTime(
                LocalDateTime.now().plusMinutes(5));

        otpRepo.save(entity);

        System.out.println("OTP: " + otp);
        
        emailService.sendOtpEmail(email, otp);

        return "OTP Sent";
    }

    // VERIFY OTP
    @PostMapping("/verify-otp")
    public String verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {

        OtpEntity data = otpRepo.findTopByEmailOrderByExpiryTimeDesc(email);

        if (data == null) {
            return "Invalid Email";
        }

        if (!data.getOtp().trim().equals(otp.trim())) {
            return "Wrong OTP";
        }

        if (data.getExpiryTime()
                .isBefore(LocalDateTime.now())) {

            return "OTP Expired";
        }

        return "Verified";
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestParam String email,
            @RequestParam String password) {

        User user = userRepo.findByEmail(email);

        if (user == null) {
            return "User Not Found";
        }

        // BCrypt encode password
        user.setPassword(passwordEncoder.encode(password));

        userRepo.save(user);

        return "Password Updated";
    }
}