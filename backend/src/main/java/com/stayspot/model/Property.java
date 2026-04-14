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
    private String ownerName;
    private String mobileNumber;
    private String address;
    private String houseNo;
    private String streetNo;
    private Double rentPrice;
    private Double securityDeposit;
    private String houseType;
    private String bhk;
    private String furnishing;
    private String availableFrom;
    @ElementCollection
    private List<String> amenities;
    private Double latitude;
    private Double longitude;
    @ElementCollection
    @Column(columnDefinition = "LONGTEXT")
    private List<String> images;

    private String status; // Pending, Approved, Rejected
    private String remark;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (status == null)
            status = "Pending";
    }
}
