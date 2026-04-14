import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { landlordService, propertyService } from "../services/api";

export default function LandlordStatus() {
  const navigate = useNavigate();
  const [landlordData, setLandlordData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.username) {
      setLoading(false);
      return;
    }

    const p1 = landlordService
      .getByUsername(user.username)
      .then((res) => {
        if (Array.isArray(res)) {
          // Sort explicitly by ID descending just in case
          const sorted = [...res].sort((a, b) => b.id - a.id);
          setLandlordData(sorted.length ? sorted[0] : null);
        } else {
          setLandlordData(res || null);
        }
      })
      .catch(() => { });

    const p2 = propertyService
      .getByOwner(user.username)
      .then((res) => {
        if (!res) {
          setProperties([]);
          return;
        }
        const latestPropsMap = new Map();
        res.forEach(prop => {
          const key = `${prop.houseType}-${prop.address}-${prop.houseNo}`;
          if (!latestPropsMap.has(key)) {
            latestPropsMap.set(key, prop);
          }
        });
        setProperties(Array.from(latestPropsMap.values()));
      })
      .catch(() => { });

    Promise.all([p1, p2]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div style={containerStyle}>
      <div style={mainCardStyle}>
        <h2 style={cardTitleStyle}>Landlord Status</h2>

        {landlordData && (
          <div style={{ marginBottom: "32px", paddingBottom: "20px", borderBottom: "1px solid #f0f0f0" }}>
            <p style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
              <b>Landlord Status:</b>{" "}
              <span
                style={{
                  color:
                    landlordData.status === "Approved"
                      ? "#28a745"
                      : landlordData.status === "Rejected"
                        ? "#dc3545"
                        : "#f39c12",
                  fontWeight: "600",
                }}
              >
                {landlordData.status}
              </span>
            </p>

            {landlordData.status === "Pending" && (
              <p style={{ color: "#856404", fontSize: "14px", margin: 0 }}>
                ⏳ Waiting for admin approval
              </p>
            )}

            {landlordData.remark && (
              <p style={{ color: "#dc3545", fontSize: "14px", marginTop: "10px", margin: 0 }}>
                <b>Admin Remark:</b> {landlordData.remark}
              </p>
            )}

            {landlordData.status === "Rejected" && (
              <button
                onClick={() => navigate("/landlord-form", { state: landlordData })}
                style={primaryButtonStyle}
              >
                Fill Again
              </button>
            )}
          </div>
        )}

        {JSON.parse(localStorage.getItem("user"))?.role === "LANDLORD" && (
          <>
            <h2 style={{ ...cardTitleStyle, fontSize: "20px", marginBottom: "20px" }}>My Properties Status</h2>

            {properties.length === 0 && (
              <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>No properties added yet.</p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {properties.map((prop) => {
                const status = prop.status?.toUpperCase();
                const color =
                  status === "APPROVED"
                    ? "#28a745"
                    : status === "REJECTED"
                      ? "#dc3545"
                      : "#f39c12";

                const handleDelete = async (id) => {
                  if (window.confirm("Are you sure you want to delete this property? It will be removed permanently.")) {
                    try {
                      await propertyService.delete(id);
                      setProperties(properties.filter(p => p.id !== id));
                      alert("Property deleted successfully");
                    } catch (err) {
                      alert("Failed to delete property");
                    }
                  }
                };

                return (
                  <div key={prop.id} style={propertyCardStyle}>
                    <div style={propHeaderStyle}>
                      <h3 style={propTitleStyle}>{prop.houseType || "Property Listing"}</h3>
                      {(status === "PENDING" || status === "REJECTED") && (
                        <button
                          onClick={() => handleDelete(prop.id)}
                          style={deleteButtonStyle}
                          title="Delete Property"
                        >
                          <span style={{ fontSize: "14px" }}>🗑️</span> Delete
                        </button>
                      )}
                    </div>

                    <p style={propAddressStyle}>{prop.address}</p>

                    <p style={{ margin: "12px 0 8px 0", fontSize: "15px" }}>
                      <b style={{ color: "#333" }}>Status:</b>{" "}
                      <span style={{ color, fontWeight: "700", letterSpacing: "0.5px" }}>
                        {status}
                      </span>
                    </p>

                    {status === "REJECTED" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "12px" }}>
                        <p style={{ color: "#dc3545", fontSize: "14px", margin: 0 }}>
                          <b>Admin Remark:</b> {prop.remark || prop.adminRemark || "No remark provided"}
                        </p>
                        <button
                          onClick={() => navigate("/add-property", { state: prop })}
                          style={fillAgainButtonStyle}
                        >
                          Fill Again
                        </button>
                      </div>
                    )}

                    {status === "PENDING" && (
                      <p style={{ color: "#856404", fontSize: "14px", margin: "10px 0 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>⏳</span> Waiting for admin approval
                      </p>
                    )}

                    {status === "APPROVED" && (
                      <p style={{ color: "#28a745", fontSize: "14px", margin: "10px 0 0 0", display: "flex", alignItems: "center", gap: "6px" }}>
                        <span>✅</span> Property is live
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f4f7f6",
  padding: "50px 20px",
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const mainCardStyle = {
  backgroundColor: "#ffffff",
  maxWidth: "800px",
  width: "100%",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  border: "1px solid #eaeaea",
};

const cardTitleStyle = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#2d3436",
  marginBottom: "12px",
  marginTop: 0,
};

const propertyCardStyle = {
  backgroundColor: "#ffffff",
  border: "1px solid #eeeeee",
  borderRadius: "12px",
  padding: "24px",
  transition: "transform 0.2s, box-shadow 0.2s",
  position: "relative",
};

const propHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "4px",
};

const propTitleStyle = {
  margin: 0,
  fontSize: "18px",
  fontWeight: "600",
  color: "#2d3436",
};

const propAddressStyle = {
  margin: 0,
  fontSize: "14px",
  color: "#636e72",
};

const deleteButtonStyle = {
  background: "#fff",
  border: "1px solid #fab1a0",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  color: "#d63031",
  padding: "6px 14px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontWeight: "600",
  transition: "all 0.2s",
};

const primaryButtonStyle = {
  marginTop: "16px",
  padding: "10px 24px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "15px",
  fontWeight: "600",
  transition: "background 0.2s",
};

const fillAgainButtonStyle = {
  padding: "8px 20px",
  background: "#0984e3",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  transition: "background 0.2s",
  boxShadow: "0 4px 10px rgba(9, 132, 227, 0.2)",
};
