package com.stayspot.repository;

import com.stayspot.model.LandlordRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LandlordRequestRepository extends JpaRepository<LandlordRequest, Long> {
    List<LandlordRequest> findByUsername(String username);

    List<LandlordRequest> findAllByUsernameOrderByIdDesc(String username);

    List<LandlordRequest> findByStatus(String status);
}
