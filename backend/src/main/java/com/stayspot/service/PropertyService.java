package com.stayspot.service;

import com.stayspot.dto.PropertyRequest;
import com.stayspot.dto.PropertyResponse;
import com.stayspot.model.Property;
import com.stayspot.repository.PropertyRepository;
import com.stayspot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {
    private final PropertyRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public PropertyResponse create(PropertyRequest req) {
        Property p = Property.builder()
                .ownerUsername(req.getOwnerUsername())
                .ownerName(req.getOwnerName())
                .mobileNumber(req.getMobileNumber())
                .title(req.getTitle())
                .address(req.getAddress())
                .houseNo(req.getHouseNo())
                .streetNo(req.getStreetNo())
                .rentPrice(req.getRentPrice())
                .securityDeposit(req.getSecurityDeposit())
                .houseType(req.getHouseType())
                .bhk(req.getBhk())
                .furnishing(req.getFurnishing())
                .availableFrom((req.getAvailableFrom() != null && !req.getAvailableFrom().isEmpty()) ? java.time.LocalDate.parse(req.getAvailableFrom()) : null)
                .amenities(req.getAmenities())
                .images(req.getImages())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .status("Pending")
                .build();

        p = repository.save(p);
        return mapToResponse(p);
    }

    public List<PropertyResponse> getByOwner(String username) {
        return repository.findAllByOwnerUsernameOrderByIdDesc(username).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyResponse> getApproved() {
        return repository.findByStatus("Approved").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<PropertyResponse> getPending() {
        return repository.findByStatus("Pending").stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public PropertyResponse mapToResponse(Property p) {
        Long ownerId = userRepository.findByUsername(p.getOwnerUsername())
                .map(u -> u.getId())
                .orElse(null);

        return PropertyResponse.builder()
                .id(p.getId())
                .ownerId(ownerId)
                .ownerUsername(p.getOwnerUsername())
                .ownerName(p.getOwnerName())
                .mobileNumber(p.getMobileNumber())
                .title(p.getTitle())
                .address(p.getAddress())
                .houseNo(p.getHouseNo())
                .streetNo(p.getStreetNo())
                .rentPrice(p.getRentPrice())
                .securityDeposit(p.getSecurityDeposit())
                .houseType(p.getHouseType())
                .bhk(p.getBhk())
                .furnishing(p.getFurnishing())
                .availableFrom(p.getAvailableFrom() != null ? p.getAvailableFrom().toString() : null)
                .amenities(p.getAmenities())
                .images(p.getImages())
                .latitude(p.getLatitude())
                .longitude(p.getLongitude())
                .status(p.getStatus())
                .remark(p.getRemark())
                .createdAt(p.getCreatedAt())
                .build();
    }

    @Transactional
    public Optional<Property> approve(Long id) {
        Optional<Property> opt = repository.findById(id);
        opt.ifPresent(p -> {
            p.setStatus("Approved");
            p.setRemark(null);
            repository.save(p);
        });
        return opt;
    }

    @Transactional
    public Optional<Property> reject(Long id, String remark) {
        Optional<Property> opt = repository.findById(id);
        opt.ifPresent(p -> {
            p.setStatus("Rejected");
            p.setRemark(remark);
            repository.save(p);
        });
        return opt;
    }

    @Transactional
    public void deleteById(Long id) {
        repository.findById(id).ifPresent(p -> {
            repository.delete(p);
        });
    }
}
