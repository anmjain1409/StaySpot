import { useEffect, useState } from "react";
import { propertyService } from "../services/api";

export default function PropertyApproval() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarkMap, setRemarkMap] = useState({});

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = () => {
    setLoading(true);
    propertyService
      .getPending()
      .then((res) => {
        setProperties(res || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleApprove = async (id) => {
    await propertyService.approve(id);
    alert("Property approved");
    fetchPending();
  };

  const handleReject = async (id) => {
    const remark = remarkMap[id];
    if (!remark || !remark.trim()) {
      alert("Please enter a remark before rejecting");
      return;
    }

    await propertyService.reject(id, remark);
    alert("Property rejected with remark");
    fetchPending();
  };

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="page-center">
      <div className="card-glass" style={{ width: "100%" }}>
        <h2>Pending Property Approvals</h2>

        {properties.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              borderRadius: 10,
              marginTop: 15,
            }}
          >
            <h3>{p.title}</h3>
            <p>{p.address}</p>

            {/* ✅ REMARK INPUT */}
            <textarea
              placeholder="Enter rejection reason"
              value={remarkMap[p.id] || ""}
              onChange={(e) =>
                setRemarkMap({ ...remarkMap, [p.id]: e.target.value })
              }
              style={{ width: "100%", minHeight: 70, marginTop: 10 }}
            />

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={() => handleApprove(p.id)} style={approveBtn}>
                Approve
              </button>
              <button onClick={() => handleReject(p.id)} style={rejectBtn}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const approveBtn = {
  background: "#28a745",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
};

const rejectBtn = {
  background: "#dc3545",
  color: "white",
  padding: "8px 16px",
  border: "none",
  borderRadius: 6,
};
