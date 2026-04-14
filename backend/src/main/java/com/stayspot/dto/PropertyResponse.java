package com.stayspot.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private Long ownerId;
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
    private List<String> amenities;
    private List<String> images;
    private Double latitude;
    private Double longitude;
    private String status;
    private String remark;
    private LocalDateTime createdAt;
}
