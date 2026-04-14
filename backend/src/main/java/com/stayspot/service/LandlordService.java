package com.stayspot.service;

import com.stayspot.dto.LandlordRequestDto;
import com.stayspot.dto.LandlordResponse;
import com.stayspot.model.LandlordRequest;
import com.stayspot.repository.LandlordRequestRepository;
import com.stayspot.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LandlordService {
    private final LandlordRequestRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public LandlordResponse submitRequest(LandlordRequestDto dto) {
        LandlordRequest entity = LandlordRequest.builder()
                .username(dto.getUsername())
                .name(dto.getName())
                .address(dto.getAddress())
                .aadhaar(dto.getAadhaar())
                .contact(dto.getContact())
                .countryCode(dto.getCountryCode())
                .status("Pending")
                .build();

        entity = repository.save(entity);

        return LandlordResponse.builder()
                .id(entity.getId())
                .username(entity.getUsername())
                .status(entity.getStatus())
                .message("Request submitted")
                .build();
    }

    public Optional<LandlordRequest> getById(Long id) {
        return repository.findById(id);
    }

    public List<LandlordRequest> getByUsername(String username) {
        return repository.findAllByUsernameOrderByIdDesc(username);
    }

    public List<LandlordRequest> getPending() {
        return repository.findByStatus("Pending");
    }

    @Transactional
    public Optional<LandlordRequest> approve(Long id) {
        Optional<LandlordRequest> opt = repository.findById(id);
        opt.ifPresent(req -> {
            req.setStatus("Approved");
            req.setRemark(null);
            repository.save(req);
            // update user role to LANDLORD when approved
            userRepository.findByUsername(req.getUsername()).ifPresent(user -> {
                user.setRole("LANDLORD");
                userRepository.save(user);
            });
        });
        return opt;
    }

    @Transactional
    public Optional<LandlordRequest> reject(Long id, String remark) {
        Optional<LandlordRequest> opt = repository.findById(id);
        opt.ifPresent(req -> {
            req.setStatus("Rejected");
            req.setRemark(remark);
            repository.save(req);
        });
        return opt;
    }
}
