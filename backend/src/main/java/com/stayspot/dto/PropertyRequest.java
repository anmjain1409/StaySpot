package com.stayspot.dto;

import lombok.Data;
import java.util.List;

@Data
public class PropertyRequest {
    private String ownerUsername;
    private String ownerName;
    private String mobileNumber;
    private String title;
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
}
