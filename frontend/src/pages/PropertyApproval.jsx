import { useEffect, useState } from "react";
import { propertyService } from "../services/api";

export default function PropertyApproval() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getPending()
      .then((res) => {
        setLoading(false);
        setProperties(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        setLoading(false);
        setProperties([]);
      });
  }, []);

  const updateStatus = (id, status) => {
    setProperties(properties.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const handleApprove = (id) => {
    propertyService
      .approve(id)
      .then(() => {
        updateStatus(id, "Approved");
      })
      .catch((err) => {
        alert(err.message || "Approve failed");
      });
  };

  const handleReject = (id) => {
    propertyService
      .reject(id)
      .then(() => {
        updateStatus(id, "Rejected");
      })
      .catch((err) => {
        alert(err.message || "Reject failed");
      });
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;

  return (
    <div className="page-center">
      <div className="card-glass" style={{ textAlign: "center" }}>
        <h2>Property Approvals</h2>

        {properties.length === 0 && <p>No pending properties.</p>}

        {properties.map((prop) => (
          <div
            key={prop.id}
            style={{ marginTop: "20px", borderBottom: "1px solid gray", paddingBottom: "10px" }}>
            <p>
              <b>Title:</b> {prop.title}
            </p>
            <p>
              <b>Owner:</b> {prop.ownerUsername}
            </p>
            <p>
              <b>Address:</b> {prop.address}
            </p>
            <p>
              <b>House No:</b> {prop.houseNo}, <b>Street:</b> {prop.streetNo}
            </p>
            <p>
              <b>Rent:</b> ${prop.rentPrice}, <b>Type:</b> {prop.houseType}
            </p>
            <p>
              <b>Amenities:</b> {prop.amenities?.join(", ") || "None"}
            </p>
            <p>
              <b>Status:</b> {prop.status}
            </p>

            <button onClick={() => handleApprove(prop.id)} style={{ marginRight: "10px" }}>
              Approve
            </button>

            <button onClick={() => handleReject(prop.id)}>Reject</button>
          </div>
        ))}
      </div>
    </div>
  );
}