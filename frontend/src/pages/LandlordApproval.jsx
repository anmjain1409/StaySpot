import { useEffect, useState } from "react";
import { landlordService } from "../services/api";

export default function LandlordApproval() {
  const [requests, setRequests] = useState([]);
  const [remarkInput, setRemarkInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    landlordService
      .getPending()
      .then((res) => {
        setLoading(false);
        setRequests(Array.isArray(res) ? res : []);
      })
      .catch(() => {
        setLoading(false);
        setRequests([]);
      });
  }, []);

  const updateStatus = (id, status, remark = "") => {
    const updated = requests.map((req) => (req.id === id ? { ...req, status, remark } : req));
    setRequests(updated);

    // Save Globally for Status Page if this is the user's request
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const username = user?.username;
    const changed = updated.find((r) => r.id === id && r.username === username);
    if (changed) localStorage.setItem("landlordStatus", JSON.stringify(changed));
  };

  const handleReject = (id) => {
    setSelectedId(id);
    // show remark area by setting selectedId — UI will show below
  };

  const confirmReject = () => {
    if (!selectedId) return;
    landlordService
      .reject(selectedId, remarkInput)
      .then(() => {
        updateStatus(selectedId, "Rejected", remarkInput);
        setRemarkInput("");
        setSelectedId(null);
      })
      .catch((err) => {
        alert(err.message || "Reject failed");
      });
  };

  const handleApprove = (id) => {
    landlordService
      .approve(id)
      .then(() => {
        updateStatus(id, "Approved", "");
      })
      .catch((err) => {
        alert(err.message || "Approve failed");
      });
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;

  return (
    <div className="page-center">
      <div className="card-glass" style={{ textAlign: "center" }}>
        <h2>Landlord Requests</h2>

        {requests.length === 0 && <p>No pending requests.</p>}

        {requests.map((req) => (
          <div
            key={req.id}
            style={{ marginTop: "20px", borderBottom: "1px solid gray", paddingBottom: "10px" }}>
            <p>
              <b>Name:</b> {req.name}
            </p>
            <p>
              <b>Status:</b> {req.status}
            </p>

            <button onClick={() => handleApprove(req.id)} style={{ marginRight: "10px" }}>
              Approve
            </button>

            <button onClick={() => handleReject(req.id)}>Reject</button>

            {selectedId === req.id && (
              <div style={{ marginTop: "10px" }}>
                <textarea
                  style={{ width: "100%", padding: "10px" }}
                  placeholder="Enter remark for rejection..."
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                ></textarea>

                <button style={{ marginTop: "10px" }} onClick={confirmReject}>
                  Submit Remark
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
