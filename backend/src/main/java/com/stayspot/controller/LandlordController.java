package com.stayspot.controller;

import com.stayspot.dto.LandlordRequestDto;
import com.stayspot.dto.LandlordResponse;
import com.stayspot.model.LandlordRequest;
import com.stayspot.service.LandlordService;
import com.stayspot.service.UserService;
import com.stayspot.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/landlord")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class LandlordController {
    private final LandlordService service;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/request")
    public ResponseEntity<LandlordResponse> submit(@RequestBody LandlordRequestDto dto) {
        LandlordResponse resp = service.submitRequest(dto);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<LandlordRequest>> getByUser(@PathVariable String username) {
        List<LandlordRequest> list = service.getByUsername(username);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<LandlordRequest>> getPending() {
        return ResponseEntity.ok(service.getPending());
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id, HttpServletRequest request) {
        Optional<LandlordRequest> opt = service.approve(id);
        return opt.map(r -> ResponseEntity.ok(r)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id, @RequestBody(required = false) LandlordResponse body, HttpServletRequest request) {
        if (!isAdmin(request)) {
            return ResponseEntity.status(403).body("Forbidden: admin only");
        }
        String remark = body != null ? body.getRemark() : null;
        Optional<LandlordRequest> opt = service.reject(id, remark);
        return opt.map(r -> ResponseEntity.ok(r)).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private boolean isAdmin(HttpServletRequest request) {
        try {
            String header = request.getHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) return false;
            String token = header.substring(7);
            if (!jwtUtil.isTokenValid(token)) return false;
            String username = jwtUtil.extractUsername(token);
            return userService.getUserByUsername(username).map(u -> "ADMIN".equalsIgnoreCase(u.getRole())).orElse(false);
        } catch (Exception ex) {
            return false;
        }
    }
}
