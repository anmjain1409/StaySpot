package com.stayspot.controller;

import com.stayspot.model.Booking;
import com.stayspot.model.BookingStatus;
import com.stayspot.model.Property;
import com.stayspot.repository.BookingRepository;
import com.stayspot.repository.PropertyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;

    public BookingController(BookingRepository bookingRepository, PropertyRepository propertyRepository) {
        this.bookingRepository = bookingRepository;
        this.propertyRepository = propertyRepository;
    }

    // USER → CREATE BOOKING
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        System.out.println("Received booking request: " + booking);
        if (booking.getUserId() == null || booking.getPropertyId() == null || booking.getLandlordId() == null) {
            return ResponseEntity.badRequest().body("Required fields missing: userId, propertyId, or landlordId");
        }

        // Check if user already has a booking for this property
        var existingBooking = bookingRepository.findByUserIdAndPropertyId(
                booking.getUserId(),
                booking.getPropertyId());

        if (existingBooking.isPresent()) {
            Booking existing = existingBooking.get();
            if (existing.getStatus() == BookingStatus.APPROVED) {
                return ResponseEntity.badRequest().body("You have already booked this property");
            } else if (existing.getStatus() == BookingStatus.PENDING) {
                return ResponseEntity.badRequest().body("You already have a pending booking request for this property");
            }
            // If REJECTED, allow rebooking
        }

        try {
            Booking saved = bookingRepository.save(booking);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Database error saving booking: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Database Error: " + e.getMessage());
        }
    }

    // USER → VIEW BOOKINGS
    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // CHECK IF USER HAS APPROVED BOOKING FOR PROPERTY
    @GetMapping("/check/{userId}/{propertyId}")
    public ResponseEntity<?> checkUserBooking(@PathVariable Long userId, @PathVariable Long propertyId) {
        boolean hasApprovedBooking = bookingRepository.existsByUserIdAndPropertyIdAndStatus(
                userId, propertyId, BookingStatus.APPROVED);
        return ResponseEntity.ok(new BookingCheckResponse(hasApprovedBooking));
    }

    // Inner class for response
    static class BookingCheckResponse {
        private boolean hasApprovedBooking;

        public BookingCheckResponse(boolean hasApprovedBooking) {
            this.hasApprovedBooking = hasApprovedBooking;
        }

        public boolean isHasApprovedBooking() {
            return hasApprovedBooking;
        }

        public void setHasApprovedBooking(boolean hasApprovedBooking) {
            this.hasApprovedBooking = hasApprovedBooking;
        }
    }

    // LANDLORD → VIEW REQUESTS (ONLY PENDING)
    @GetMapping("/landlord/{landlordId}")
    public List<Booking> getLandlordBookings(@PathVariable Long landlordId) {
        return bookingRepository.findByLandlordIdAndStatus(landlordId, BookingStatus.PENDING);
    }

    // LANDLORD → APPROVE
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus(BookingStatus.APPROVED);
            booking.setRemarks(null);
            return ResponseEntity.ok(bookingRepository.save(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // LANDLORD → REJECT
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody String remarks) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            booking.setStatus(BookingStatus.REJECTED);
            // Simple cleanup if string is passed with quotes
            String cleanRemarks = remarks.replace("\"", "");
            booking.setRemarks(cleanRemarks);
            return ResponseEntity.ok(bookingRepository.save(booking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN → GET STATS
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long bookedCount = bookingRepository.countByStatus(BookingStatus.APPROVED);
        return ResponseEntity.ok(new StatsResponse(bookedCount));
    }

    // ADMIN → GET BOOKED HOUSES WITH PROPERTY DETAILS
    @GetMapping("/booked-houses")
    public ResponseEntity<?> getBookedHouses() {
        List<Booking> approvedBookings = bookingRepository.findByStatus(BookingStatus.APPROVED);

        // Fetch property details for each booking
        List<Map<String, Object>> bookedHousesWithDetails = approvedBookings.stream()
                .map(booking -> {
                    Map<String, Object> details = new HashMap<>();
                    Property property = propertyRepository.findById(booking.getPropertyId()).orElse(null);

                    if (property != null) {
                        details.put("bookingId", booking.getId());
                        details.put("landlordName", property.getOwnerName() != null ? property.getOwnerName()
                                : property.getOwnerUsername());
                        details.put("houseNumber", property.getHouseNo());
                        details.put("streetNo", property.getStreetNo());
                        details.put("houseType", property.getHouseType());
                        details.put("rent", property.getRentPrice());
                        details.put("address", property.getAddress());
                    }

                    return details;
                })
                .filter(details -> !details.isEmpty())
                .collect(Collectors.toList());

        return ResponseEntity.ok(bookedHousesWithDetails);
    }

    // ADMIN → GET VACANT HOUSES (NOT BOOKED)
    @GetMapping("/vacant-houses")
    public ResponseEntity<?> getVacantHouses() {
        // Get all approved bookings
        List<Booking> approvedBookings = bookingRepository.findByStatus(BookingStatus.APPROVED);

        // Extract booked property IDs
        List<Long> bookedPropertyIds = approvedBookings.stream()
                .map(Booking::getPropertyId)
                .collect(Collectors.toList());

        // Get all approved properties
        List<Property> allProperties = propertyRepository.findByStatus("APPROVED");

        // Filter out booked properties
        List<Property> vacantProperties = allProperties.stream()
                .filter(property -> !bookedPropertyIds.contains(property.getId()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(vacantProperties);
    }

    // Inner class for stats response
    static class StatsResponse {
        private long bookedHouses;

        public StatsResponse(long bookedHouses) {
            this.bookedHouses = bookedHouses;
        }

        public long getBookedHouses() {
            return bookedHouses;
        }

        public void setBookedHouses(long bookedHouses) {
            this.bookedHouses = bookedHouses;
        }
    }
}
