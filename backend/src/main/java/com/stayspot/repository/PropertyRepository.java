package com.stayspot.repository;

import com.stayspot.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwnerUsername(String ownerUsername);

    List<Property> findAllByOwnerUsernameOrderByIdDesc(String ownerUsername);

    List<Property> findByStatus(String status);
}
