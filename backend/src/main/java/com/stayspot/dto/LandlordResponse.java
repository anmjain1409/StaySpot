package com.stayspot.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LandlordResponse {
    private Long id;
    private String username;
    private String status;
    private String remark;
    private String message;
}
