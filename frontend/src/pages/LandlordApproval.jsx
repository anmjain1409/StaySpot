import { useState } from "react";

export default function LandlordApproval() {
  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Test Landlord",
      status: "Pending",
      remark: ""
    }
  ]);

  const [remarkInput, setRemarkInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const updateStatus = (id, status, remark = "") => {
    const updated = requests.map(req =>
      req.id === id ? { ...req, status, remark } : req
    );
    setRequests(updated);

    // Save Globally for Status Page
    localStorage.setItem("landlordStatus", JSON.stringify(updated[0]));
  };

  const handleReject = (id) => {
    setSelectedId(id);
    document.getElementById("remarkBox").style.display = "block";
  };

  const confirmReject = () => {
    updateStatus(selectedId, "Rejected", remarkInput);
    setRemarkInput("");
    document.getElementById("remarkBox").style.display = "none";
  };

  return (
    <div className="page-center">
      <div className="card-glass" style={{ textAlign: "center" }}>
        <h2>Landlord Requests</h2>

        {requests.map(req => (
          <div key={req.id}
            style={{ marginTop: "20px", borderBottom: "1px solid gray", paddingBottom: "10px" }}>
            <p><b>Name:</b> {req.name}</p>
            <p><b>Status:</b> {req.status}</p>

            <button
              onClick={() => updateStatus(req.id, "Approved")}
              style={{ marginRight: "10px" }}>
              Approve
            </button>

            <button onClick={() => handleReject(req.id)}>
              Reject
            </button>
          </div>
        ))}

        {/* Remark Popup */}
        <div id="remarkBox"
          style={{
            display: "none",
            marginTop: "20px"
          }}>
          <textarea
            style={{ width: "100%", padding: "10px" }}
            placeholder="Enter remark for rejection..."
            onChange={(e) => setRemarkInput(e.target.value)}
          ></textarea>

          <button style={{ marginTop: "10px" }} onClick={confirmReject}>
            Submit Remark
          </button>
        </div>
      </div>
    </div>
  );
}
