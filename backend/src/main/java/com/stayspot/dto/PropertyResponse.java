package com.stayspot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String ownerUsername;
    private String title;
    private String description;
    private String address;
    private String houseNo;
    private String streetNo;
    private Double rentPrice;
    private String houseType;
    private List<String> amenities;
    private Double latitude;
    private Double longitude;
    private String status;
    private LocalDateTime createdAt;
}
