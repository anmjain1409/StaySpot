import { useEffect, useState } from "react";
import { propertyService } from "../services/api";
import { bookingService } from "../services/bookingService";
import bgImage from "../assets/Background.png";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [approvedPropertyIds, setApprovedPropertyIds] = useState(new Set());

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
    }

    propertyService
      .getApproved()
      .then((res) => {
        setLoading(false);
        setProperties(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
        setProperties([]);
      });
  }, []);

  // Fetch user's approved bookings when user is available
  useEffect(() => {
    if (currentUser?.id) {
      bookingService.getUserBookings(currentUser.id)
        .then((bookings) => {
          const approvedIds = new Set(
            bookings
              .filter(b => b.status === "APPROVED")
              .map(b => b.propertyId)
          );
          setApprovedPropertyIds(approvedIds);
        })
        .catch((err) => {
          console.error("Error fetching user bookings:", err);
        });
    }
  }, [currentUser]);

  const handleBook = async (property) => {
    if (!currentUser) {
      alert("Please login to book a property");
      return;
    }

    if (!currentUser.id) {
      alert("User identification missing. Please Logout and Login again to refresh your session.");
      return;
    }

    try {
      const bookingData = {
        userId: currentUser.id,
        propertyId: property.id,
        landlordId: property.ownerId,
      };

      console.log("Sending booking request:", bookingData);

      if (!bookingData.landlordId) {
        alert("Landlord information missing for this property. Cannot book.");
        return;
      }

      await bookingService.createBooking(bookingData);
      alert("Booking request sent successfully!");
    } catch (err) {
      console.error("Booking error:", err);
      // err.message now includes status code and server body
      alert("Booking Failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "28px",
          color: "#fff",
        }}
      >
        Available Properties
      </h2>

      {properties.length === 0 && (
        <p style={{ textAlign: "center", color: "#fff" }}>
          No properties available.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {properties.map((prop) => (
          <div
            key={prop.id}
            style={{
              backgroundColor: "#ffffff",
              padding: "18px",
              borderRadius: "14px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            }}
          >
            <h3 style={{ color: "#2563eb", marginBottom: "6px" }}>
              {prop.houseType || "Property Listing"}
            </h3>


            <p>📍 {prop.address}</p>
            <p>🏠 {prop.houseNo}, Street {prop.streetNo}</p>
            <p>🏷 {prop.houseType}</p>

            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#16a34a",
                }}
              >
                ₹ {prop.rentPrice}
              </span>

              <span style={{ fontSize: "13px", color: "#64748b" }}>
                {prop.amenities?.join(", ") || "No amenities"}
              </span>
            </div>

            {/* Book Now Button */}
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={() => handleBook(prop)}
                disabled={
                  currentUser?.username === prop.ownerUsername ||
                  approvedPropertyIds.has(prop.id)
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor:
                    currentUser?.username === prop.ownerUsername || approvedPropertyIds.has(prop.id)
                      ? "#cbd5e1"
                      : "#2563eb",
                  color: "#fff",
                  fontWeight: "bold",
                  cursor:
                    currentUser?.username === prop.ownerUsername || approvedPropertyIds.has(prop.id)
                      ? "not-allowed"
                      : "pointer",
                  transition: "background 0.2s"
                }}
              >
                {currentUser?.username === prop.ownerUsername
                  ? "Your Property"
                  : approvedPropertyIds.has(prop.id)
                    ? "My Property"
                    : "Book Now"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
