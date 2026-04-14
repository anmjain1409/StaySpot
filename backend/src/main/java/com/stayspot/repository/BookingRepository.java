package com.stayspot.repository;

import com.stayspot.model.Booking;
import com.stayspot.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(Long userId);

    List<Booking> findByLandlordId(Long landlordId);

    // Find only PENDING bookings for landlord
    List<Booking> findByLandlordIdAndStatus(Long landlordId, BookingStatus status);

    // Check if user has any booking (pending/approved) for a property
    Optional<Booking> findByUserIdAndPropertyId(Long userId, Long propertyId);

    // Check if user has approved booking for a property
    boolean existsByUserIdAndPropertyIdAndStatus(Long userId, Long propertyId, BookingStatus status);

    // Count approved bookings (for admin dashboard)
    long countByStatus(BookingStatus status);

    // Find all bookings by status
    List<Booking> findByStatus(BookingStatus status);
}
