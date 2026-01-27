package com.stayspot.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "properties")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerUsername;
    private String title;
    private String description;
    private String address;
    private String houseNo;
    private String streetNo;
    private Double rentPrice;
    private String houseType; // e.g., Apartment, House, Villa
    @ElementCollection
    private List<String> amenities; // e.g., WiFi, Parking, etc.
    private Double latitude;
    private Double longitude;
    private String status; // Pending, Approved, Rejected

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null) status = "Pending";
    }
}
