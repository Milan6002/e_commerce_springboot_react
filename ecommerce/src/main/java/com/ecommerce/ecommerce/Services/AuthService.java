package com.ecommerce.ecommerce.Services;

import java.io.IOException;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Model.LoginModel;
import com.ecommerce.ecommerce.Model.ProfileModel;
import com.ecommerce.ecommerce.Model.UserModel;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Utility.JwtUtil;

@Service
public class AuthService {

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    public String register(UserModel userModel, MultipartFile image) throws IOException {
        if (userRepository.findByEmail(userModel.getEmail()) == null) {
            return "User already exists";
        }
        User user = new User();
        BeanUtils.copyProperties(userModel, user);
        user.setPassword(passwordEncoder.encode(userModel.getPassword()));
        user.setRole("ROLE_USER");
        user.setImg(image.getBytes());
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(LoginModel loginModel) {
        User user = userRepository.findByEmail(loginModel.getEmail());
        if (user == null) {
            return "No Record Found";
        }
        if (!passwordEncoder.matches(loginModel.getPassword(), user.getPassword())) {
            return "Invalid credentials";
        }

        return jwtUtil.generateToken(loginModel.getEmail());
    }

    public ProfileModel getuserprofile(String email) {
        User user = userRepository.findByEmail(email);
        ProfileModel profileModel = new ProfileModel();
        BeanUtils.copyProperties(user, profileModel);
        return profileModel;
    }

    public ProfileModel ReadProfileById(Long id) {
        User user = userRepository.findById(id).get();
        ProfileModel profileModel = new ProfileModel();
        BeanUtils.copyProperties(user, profileModel);
        return profileModel;
    }

    public String Updateprofile(Long id, ProfileModel updatedProfileModel, MultipartFile image) throws IOException {
        // Fetch the user by email
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        BeanUtils.copyProperties(updatedProfileModel, user);
        user.setImg(image.getBytes());
        userRepository.save(user);
        return "Profile updated successfully";
    }
}
