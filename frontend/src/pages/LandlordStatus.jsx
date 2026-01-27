import { useEffect, useState } from "react";
import { landlordService } from "../services/api";

export default function LandlordStatus() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const username = user?.username;

    if (!username) {
      return;
    }

    landlordService
      .getByUsername(username)
      .then((res) => {
        console.log("Fetched landlord requests for user:", username, res);
        setLoading(false);
        // backend may return a list or single object
        if (Array.isArray(res)) {
          setData(res.length ? res[0] : null);
        } else {
          setData(res || null);
        }
      })
      .catch((err) => {
        console.error("Error fetching landlord status:", err);
        setLoading(false);
        // fallback to any saved local storage
        const saved = localStorage.getItem("landlordStatus");
        if (saved) setData(JSON.parse(saved));
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;

  if (!data) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "40px" }}>
        No Request Found
      </h2>
    );
  }

  const statusColor =
    data.status === "Approved" ? "green" :
    data.status === "Rejected" ? "red" : "orange";

  return (
    <div className="page-center">
      <div className="card-glass">
        <h2>Status Check</h2>
        <p><b>Name:</b> {data.name}</p>

        <p style={{ fontSize: "22px", fontWeight: "700", color: statusColor }}>
          {data.status}
        </p>

        {data.status === "Approved" && (
          <div style={{ background: "#d4edda", color: "#155724", padding: "15px", borderRadius: "8px", marginTop: "15px", border: "1px solid #c3e6cb" }}>
            <h3 style={{ margin: "0 0 10px 0" }}>🎉 Congratulations! You are now a Landlord</h3>
            <p style={{ margin: "0 0 10px 0" }}>
              <b>Important:</b> Please <button 
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                style={{ 
                  background: "#28a745", 
                  color: "white", 
                  border: "none", 
                  padding: "5px 10px", 
                  borderRadius: "4px", 
                  cursor: "pointer",
                  margin: "0 5px"
                }}
              >Logout & Login Again</button> to access your landlord features.
            </p>
            <p style={{ margin: "0", fontSize: "14px" }}>
              After logging in again, you'll be able to add properties from your dashboard.
            </p>
          </div>
        )}

        {data.remark && (
          <p style={{ color: "red", marginTop: "10px" }}>
            <b>Remark:</b> {data.remark}
          </p>
        )}
      </div>
    </div>
  );
}
