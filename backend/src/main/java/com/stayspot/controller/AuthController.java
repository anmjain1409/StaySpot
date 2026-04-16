package com.stayspot.controller;

import com.stayspot.dto.AuthResponse;
import com.stayspot.dto.LoginRequest;
import com.stayspot.dto.RegisterRequest;
import com.stayspot.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Value;
import com.stayspot.repository.UserRepository;
import com.stayspot.model.User;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"})
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;

    @Value("${admin.create.secret:please-change-this-secret}")
    private String adminSecret;

    @PostMapping("/promote-admin")
    public ResponseEntity<?> promoteToAdmin(@RequestParam String username, @RequestParam String secret) {
        if (!adminSecret.equals(secret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid secret");
        }
        return userRepository.findByUsername(username).map(u -> {
            u.setRole("ADMIN");
            userRepository.save(u);
            return ResponseEntity.ok("User promoted to ADMIN successfully");
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest registerRequest) {
        AuthResponse response = userService.register(registerRequest);
        if (response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse response = userService.login(loginRequest);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
}
