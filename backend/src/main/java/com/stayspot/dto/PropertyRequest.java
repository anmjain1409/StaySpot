package com.stayspot.dto;

import lombok.Data;
import java.util.List;

@Data
public class PropertyRequest {
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
}
