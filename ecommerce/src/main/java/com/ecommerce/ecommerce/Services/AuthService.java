package com.ecommerce.ecommerce.Services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.ecommerce.Entity.User;
import com.ecommerce.ecommerce.Model.LoginModel;
import com.ecommerce.ecommerce.Model.ProfileModel;
import com.ecommerce.ecommerce.Model.UserModel;
import com.ecommerce.ecommerce.Model.GoogleLoginModel;
import com.ecommerce.ecommerce.Repository.UserRepository;
import com.ecommerce.ecommerce.Utility.JwtUtil;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.util.Collections;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
public class AuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id:YOUR_GOOGLE_CLIENT_ID}")
    private String googleClientId;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    // REGISTER
    public String register(UserModel userModel, MultipartFile image) throws IOException {

        if (userRepository.findByEmail(userModel.getEmail()) != null) {
            return "User already exists";
        }

        User user = new User();

        BeanUtils.copyProperties(userModel, user);

        user.setPassword(passwordEncoder.encode(userModel.getPassword()));

        user.setRole("ROLE_USER");

        // Default inactive
        user.setActive(false);

        if (image != null && !image.isEmpty()) {
            user.setImg(image.getBytes());
        }

        userRepository.save(user);

        return "User registered successfully. Wait for admin approval.";
    }

    // LOGIN
public String login(LoginModel loginModel) {

    User user = userRepository.findByEmail(loginModel.getEmail());

    if (user == null) {
        return "No Record Found";
    }

    // Check active
    if (user.getActive() == null || !user.getActive()) {
        return "Your account is not approved by admin";
    }

    // Check password
    if (!passwordEncoder.matches(
            loginModel.getPassword(),
            user.getPassword())) {

        return "Invalid credentials";
    }

    // Generate token with user information
    return jwtUtil.generateToken(user);
}

    // GOOGLE LOGIN
    public String googleLogin(GoogleLoginModel googleLoginModel) {
        try {
            NetHttpTransport transport = new NetHttpTransport();
            GsonFactory jsonFactory = new GsonFactory();

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(googleLoginModel.getToken());

            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");

                User user = userRepository.findByEmail(email);

                if (user == null) {
                    // Register new user via Google
                    user = new User();
                    user.setEmail(email);
                    user.setFirstname(givenName != null ? givenName : name);
                    user.setLastname(familyName != null ? familyName : "");
                    // generate a random password for google users
                    user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
                    user.setRole("ROLE_USER");
                    // Auto-activate since email is verified by Google
                    user.setActive(true);
                    
                    userRepository.save(user);
                } else {
                    if (user.getActive() == null || !user.getActive()) {
                        return "Your account is not approved by admin";
                    }
                }

                // Log them in
                return jwtUtil.generateToken(user);
            } else {
                return "Invalid Google Token";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error verifying Google Token: " + e.getMessage();
        }
    }
    // PROFILE
  public ProfileModel getuserprofile(String email) {

    User user = userRepository.findByEmail(email);

    if (user == null) {
        throw new RuntimeException("User not found with email: " + email);
    }

    ProfileModel profileModel = new ProfileModel();
    BeanUtils.copyProperties(user, profileModel);

    return profileModel;
}

    // UPDATE PROFILE
    public String updateProfile(Long id, ProfileModel updatedProfileModel, MultipartFile image) throws IOException {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstname(updatedProfileModel.getFirstname());
        user.setLastname(updatedProfileModel.getLastname());
        user.setEmail(updatedProfileModel.getEmail());
        user.setMobile(updatedProfileModel.getMobile());
        user.setGender(updatedProfileModel.getGender());
        user.setAddressLine1(updatedProfileModel.getAddressLine1());
        user.setAddressLine2(updatedProfileModel.getAddressLine2());
        user.setCity(updatedProfileModel.getCity());
        user.setState(updatedProfileModel.getState());
        user.setPincode(updatedProfileModel.getPincode());

        if (image != null && !image.isEmpty()) {
            user.setImg(image.getBytes());
        }

        userRepository.save(user);

        return "Profile updated successfully";
    }

    // GET ALL USERS
    public List<UserModel> getAllUsers() {

        List<User> users = userRepository.findAll();

        List<UserModel> userModels = new ArrayList<>();

        for (User user : users) {

            UserModel model = new UserModel();

            model.setFirstname(user.getFirstname());
            model.setLastname(user.getLastname());
            model.setMobile(user.getMobile());
            model.setCity(user.getCity());
            model.setRole(user.getRole());
            model.setEmail(user.getEmail());
            model.setImg(user.getImg());
            model.setId(user.getId());
            model.setAddressLine1(user.getAddressLine1());
            model.setAddressLine2(user.getAddressLine2());
            model.setState(user.getState());
            model.setPincode(user.getPincode());
            model.setCountry(user.getCountry());
            model.setGender(user.getGender());
            model.setDob(user.getDob());
            model.setActive(user.getActive());

            userModels.add(model);
        }

        return userModels;
    }

    // UPDATE USER STATUS
    public String updateUserStatus(Long id, Boolean active) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActive(active);

        userRepository.save(user);

        return "User status updated";
    }
}