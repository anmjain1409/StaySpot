package com.stayspot.controller;

import com.stayspot.dto.PropertyRequest;
import com.stayspot.dto.PropertyResponse;
import com.stayspot.service.PropertyService;
import com.stayspot.service.UserService;
import com.stayspot.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/property")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class PropertyController {

    private final PropertyService service;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    // ✅ FIXED CREATE API (sirf yahin change hua hai)
    @PostMapping("")
    public ResponseEntity<?> create(
            @RequestBody PropertyRequest req,
            HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(null);
            }

            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).build();
            }

            // token se username nikaal ke owner set karo
            String username = jwtUtil.extractUsername(token);
            req.setOwnerUsername(username);

            PropertyResponse resp = service.create(req);
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ===== BAAKI SAB SAME HAI =====

    @GetMapping("/owner/{username}")
    public ResponseEntity<?> getByOwner(@PathVariable String username) {
        return ResponseEntity.ok(service.getByOwner(username));
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getApproved() {
        return ResponseEntity.ok(service.getApproved());
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPending(HttpServletRequest request) {
        if (!isAdmin(request)) {
            String header = request.getHeader("Authorization");
            String token = header.substring(7);
            String username = jwtUtil.extractUsername(token);
            String role = userService.getUserByUsername(username).map(u -> u.getRole()).orElse("NOT_FOUND");
            return ResponseEntity.status(403).body(Map.of("error", "Forbidden", "user", username, "role", role));
        }
        return ResponseEntity.ok(service.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Forbidden: admin only");
        }
        Optional<PropertyResponse> opt = service.approve(id).map(service::mapToResponse);
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody(required = false) PropertyResponse body,
            HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Forbidden");
        }
        String remark = body != null ? body.getRemark() : null;
        Optional<com.stayspot.model.Property> opt = service.reject(id, remark);
        return opt.map(service::mapToResponse).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            service.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace(); // Log the error to console
            return ResponseEntity.status(500).body("Error deleting property: " + e.getMessage());
        }
    }

    private boolean isAdmin(HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer "))
                return false;
            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token))
                return false;
            String username = jwtUtil.extractUsername(token);
            return userService.getUserByUsername(username)
                    .map(u -> "ADMIN".equalsIgnoreCase(u.getRole()))
                    .orElse(false);
        } catch (Exception ex) {
            return false;
        }
    }

}
