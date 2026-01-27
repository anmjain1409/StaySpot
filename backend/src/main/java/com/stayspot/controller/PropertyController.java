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
import java.util.Optional;

@RestController
@RequestMapping("/api/property")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class PropertyController {

    private final PropertyService service;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    // ✅ FIXED CREATE API (sirf yahin change hua hai)
    @PostMapping("")
    public ResponseEntity<PropertyResponse> create(
            @RequestBody PropertyRequest req,
            HttpServletRequest request
    ) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(null);
            }

            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(401).body(null);
            }

            // token se username nikaal ke owner set karo
            String username = jwtUtil.extractUsername(token);
            req.setOwnerUsername(username);

            PropertyResponse resp = service.create(req);
            return ResponseEntity.ok(resp);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // ===== BAAKI SAB SAME HAI =====

    @GetMapping("/owner/{username}")
    public ResponseEntity<List<PropertyResponse>> getByOwner(@PathVariable String username) {
        return ResponseEntity.ok(service.getByOwner(username));
    }

    @GetMapping("/approved")
    public ResponseEntity<List<PropertyResponse>> getApproved() {
        return ResponseEntity.ok(service.getApproved());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<PropertyResponse>> getPending(HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body(null);
        }
        return ResponseEntity.ok(service.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Forbidden: admin only");
        }
        Optional<PropertyResponse> opt = service.approve(id).map(p -> PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build());
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Forbidden: admin only");
        }
        Optional<PropertyResponse> opt = service.reject(id).map(p -> PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build());
        return opt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private boolean isAdmin(HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) return false;
            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token)) return false;
            String username = jwtUtil.extractUsername(token);
            return userService.getUserByUsername(username)
                    .map(u -> "ADMIN".equals(u.getRole()))
                    .orElse(false);
        } catch (Exception ex) {
            return false;
        }
    }

    private boolean isLandlord(HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) return false;
            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token)) return false;
            String username = jwtUtil.extractUsername(token);
            return userService.getUserByUsername(username)
                    .map(u -> "LANDLORD".equals(u.getRole()))
                    .orElse(false);
        } catch (Exception ex) {
            return false;
        }
    }
}
