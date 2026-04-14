package com.stayspot.model;

import jakarta.persistence.*;
import lombok.*;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "landlord_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LandlordRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String name;
    private String address;
    private String aadhaar;
    private String contact;
    private String countryCode;
    @Builder.Default
    private String status = "Pending"; // Pending, Approved, Rejected
    private String remark;

    @CreationTimestamp
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
