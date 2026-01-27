package com.stayspot.service;

import com.stayspot.dto.PropertyRequest;
import com.stayspot.dto.PropertyResponse;
import com.stayspot.model.Property;
import com.stayspot.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository repository;

    public PropertyResponse create(PropertyRequest req) {
        Property p = Property.builder()
                .ownerUsername(req.getOwnerUsername())
                .title(req.getTitle())
                .description(req.getDescription())
                .address(req.getAddress())
                .houseNo(req.getHouseNo())
                .streetNo(req.getStreetNo())
                .rentPrice(req.getRentPrice())
                .houseType(req.getHouseType())
                .amenities(req.getAmenities())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .status("Pending")
                .build();

        p = repository.save(p);

        return PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build();
    }

    public List<PropertyResponse> getByOwner(String username) {
        return repository.findByOwnerUsername(username).stream().map(p -> PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    public List<PropertyResponse> getApproved() {
        return repository.findByStatus("Approved").stream().map(p -> PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    public List<PropertyResponse> getPending() {
        return repository.findByStatus("Pending").stream().map(p -> PropertyResponse.builder()
                .id(p.getId())
                .ownerUsername(p.getOwnerUsername())
                .title(p.getTitle())
                .description(p.getDescription())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .houseType(p.getHouseType())
                .amenities(p.getAmenities())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .createdAt(p.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    public Optional<Property> approve(Long id) {
        Optional<Property> opt = repository.findById(id);
        opt.ifPresent(p -> {
            p.setStatus("Approved");
            repository.save(p);
        });
        return opt;
    }

    public Optional<Property> reject(Long id) {
        Optional<Property> opt = repository.findById(id);
        opt.ifPresent(p -> {
            p.setStatus("Rejected");
            repository.save(p);
        });
        return opt;
    }
}
