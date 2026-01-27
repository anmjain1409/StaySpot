package com.stayspot.dto;

import lombok.Data;

@Data
public class LandlordRequestDto {
    private String username;
    private String name;
    private String address;
    private String aadhaar;
    private String contact;
    private String countryCode;
}
