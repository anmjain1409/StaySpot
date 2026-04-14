import { useEffect, useState } from "react";
import { bookingService } from "../services/bookingService";
import bgImage from "../assets/Background.png";

export default function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [landlord, setLandlord] = useState(null);
  const [remarksMap, setRemarksMap] = useState({});

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.role === "LANDLORD") {
        setLandlord(user);
        fetchBookings(user.id);
      }
    }
  }, []);

  const fetchBookings = (landlordId) => {
    bookingService.getLandlordBookings(landlordId).then((res) => {
      setBookings(Array.isArray(res) ? res : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  const handleApprove = async (id) => {
    try {
      await bookingService.approveBooking(id);
      alert("Booking approved!");
      fetchBookings(landlord.id);
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleReject = async (id) => {
    const remark = remarksMap[id] || "";
    if (!remark) {
      alert("Please provide a rejection reason");
      return;
    }
    try {
      await bookingService.rejectBooking(id, remark);
      alert("Booking rejected!");
      fetchBookings(landlord.id);
    } catch (err) {
      alert("Action failed");
    }
  };

  if (!landlord) return <div style={{ padding: "50px", textAlign: "center" }}>Access Denied. Only for landlords.</div>;
  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading requests...</div>;

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
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: "30px" }}>Booking Requests</h2>

      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gap: "20px" }}>
        {bookings.length === 0 && <p style={{ color: "#fff", textAlign: "center" }}>No booking requests found.</p>}
        {bookings.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <p><strong>Booking ID:</strong> #{b.id}</p>
              <p><strong>User ID:</strong> {b.userId}</p>
              <p><strong>Property ID:</strong> {b.propertyId}</p>
              <p><strong>Date:</strong> {new Date(b.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong>
                <span style={{
                  marginLeft: "8px",
                  color: b.status === "APPROVED" ? "#16a34a" : b.status === "REJECTED" ? "#dc2626" : "#ca8a04",
                  fontWeight: "bold"
                }}>
                  {b.status}
                </span>
              </p>
            </div>

            {b.status === "PENDING" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "250px" }}>
                <button
                  onClick={() => handleApprove(b.id)}
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: "8px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  Approve
                </button>
                <div style={{ display: "flex", gap: "5px" }}>
                  <input
                    placeholder="Rejection reason..."
                    value={remarksMap[b.id] || ""}
                    onChange={(e) => setRemarksMap({ ...remarksMap, [b.id]: e.target.value })}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: "1px solid #ddd"
                    }}
                  />
                  <button
                    onClick={() => handleReject(b.id)}
                    style={{
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}

            {b.status === "REJECTED" && b.remarks && (
              <p style={{ color: "#dc2626", fontSize: "14px" }}><strong>Reason:</strong> {b.remarks}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
