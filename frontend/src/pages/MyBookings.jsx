import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";
import bgImage from "../assets/Background.png";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const parsedUser = JSON.parse(userJson);
      setUser(parsedUser);
      bookingService.getUserBookings(parsedUser.id).then((res) => {
        setBookings(Array.isArray(res) ? res : []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, []);

  if (!user) return <div style={{ padding: "50px", textAlign: "center" }}>Please login to view bookings.</div>;
  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading...</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "30px" }}>My Bookings</h2>

      <div style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gap: "15px" }}>
        {bookings.length === 0 && <p style={{ color: "#fff", textAlign: "center" }}>No bookings found.</p>}
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p><strong>Booking ID:</strong> #{b.id}</p>
                <p><strong>Property ID:</strong> {b.propertyId}</p>
                <p><strong>Date:</strong> {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    backgroundColor: b.status === "APPROVED" ? "#dcfce7" : b.status === "REJECTED" ? "#fee2e2" : "#fef9c3",
                    color: b.status === "APPROVED" ? "#166534" : b.status === "REJECTED" ? "#991b1b" : "#854d0e",
                  }}
                >
                  {b.status}
                </span>
                {b.status === "APPROVED" && (
                  <p style={{ fontSize: "12px", color: "#16a34a", marginTop: "8px", fontWeight: "bold" }}>
                    ✓ Booking Approved
                  </p>
                )}
                {b.status === "REJECTED" && b.remarks && (
                  <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "8px" }}>
                    <strong>Rejection Reason:</strong> {b.remarks}
                  </p>
                )}
                {b.status === "PENDING" && (
                  <p style={{ fontSize: "12px", color: "#ca8a04", marginTop: "8px" }}>
                    Waiting for landlord response
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
