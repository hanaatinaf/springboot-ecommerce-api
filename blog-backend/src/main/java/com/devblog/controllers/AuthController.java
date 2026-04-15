package com.devblog.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.devblog.data.UserDao;
import com.devblog.models.User;
import com.devblog.models.auth.LoginRequest;
import com.devblog.models.auth.LoginResponse;
import com.devblog.models.auth.RegisterRequest;
import com.devblog.security.jwt.JwtTokenProvider;

import java.util.Map;

// @RestController = @Controller + @ResponseBody.
// This means every method automatically converts its return value to JSON.
//
// @RequestMapping("/auth") = all routes in this class start with /auth
// So register is at POST /auth/register and login is at POST /auth/login
@RestController
@RequestMapping("/auth")
@CrossOrigin
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserDao userDao;
    private final PasswordEncoder passwordEncoder;

    // Spring automatically injects all these dependencies because we annotated
    // the classes with @Component / @Service / @Bean
    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserDao userDao,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userDao = userDao;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /auth/register
    // Creates a new user account and returns the saved user info
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // Validate: username and email must be unique
        if (userDao.existsByUsername(request.getUsername())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Username is already taken"));
        }
        if (userDao.existsByEmail(request.getEmail())) {
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", "Email is already registered"));
        }

        // Build the user — notice we HASH the password before saving.
        // NEVER store plain text passwords.
        User newUser = new User();
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole("ROLE_USER");

        User saved = userDao.create(newUser);

        // Return 201 Created with the new user (password is hidden via @JsonIgnore)
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // POST /auth/login
    // Validates credentials and returns a JWT token
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // authenticationManager.authenticate() will:
            // 1. Call UserDetailsService.loadUserByUsername(request.getUsername())
            // 2. Compare the provided password with the stored hash using BCrypt
            // 3. Throw BadCredentialsException if they don't match
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            // If authentication succeeded, generate a JWT
            String token = tokenProvider.generateToken(authentication);

            // Load the user to get their ID and role for the response
            User user = userDao.getByUsername(request.getUsername());

            return ResponseEntity.ok(
                new LoginResponse(token, user.getUsername(), user.getUserId(), user.getRole())
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid username or password"));
        }
    }
}
