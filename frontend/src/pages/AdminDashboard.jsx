import { useEffect, useState } from "react";
import { FaHome, FaSignOutAlt } from "react-icons/fa"; // Added FaSignOutAlt
import { useNavigate } from "react-router-dom";
import { landlordService, authService, propertyService } from "../services/api";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]); // Pending properties
  const [approvedProperties, setApprovedProperties] = useState([]);
  const [remarkInput, setRemarkInput] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("landlords");

  /* ================= CHECK ADMIN ================= */
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.role === "ADMIN") {
      setAdminLoggedIn(true);
      fetchPending();
    }
  }, []);

  /* ================= FETCH ================= */
  const fetchPending = () => {
    setLoading(true);

    landlordService.getPending()
      .then((data) => setRequests(Array.isArray(data) ? data : []))
      .catch(() => setRequests([]));

    propertyService.getPending()
      .then((data) => setProperties(Array.isArray(data) ? data : []))
      .catch(() => setProperties([]));

    propertyService.getApproved()
      .then((data) => setApprovedProperties(Array.isArray(data) ? data : []))
      .catch(() => setApprovedProperties([]))
      .finally(() => setLoading(false));
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await authService.login(loginForm.username, loginForm.password);
      if (res.role !== "ADMIN") {
        setError("Access denied: Not admin");
        return;
      }
      setAdminLoggedIn(true);
      fetchPending();
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  /* ================= LANDLORD ACTIONS ================= */
  const handleApprove = (id) =>
    landlordService.approve(id).then(fetchPending);

  const handleReject = (id) => setSelectedId(id);

  const confirmReject = () => {
    landlordService.reject(selectedId, remarkInput).then(() => {
      setRemarkInput("");
      setSelectedId(null);
      fetchPending();
    });
  };

  /* ================= PROPERTY ACTIONS ================= */
  const handleApproveProperty = (id) =>
    propertyService.approve(id).then(fetchPending);

  const handleRejectProperty = (id) =>
    propertyService.reject(id).then(fetchPending);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  /* ================= ADMIN LOGIN UI ================= */
  if (!adminLoggedIn) {
    return (
      <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form
          onSubmit={handleLogin}
          style={{
            background: "var(--card-bg)",
            padding: 30,
            borderRadius: 12,
            width: 320,
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>
          {error && <p style={{ color: "var(--accent-red)", textAlign: "center" }}>{error}</p>}

          <input
            placeholder="Username"
            required
            className="remark-input"
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            style={{ marginBottom: 10 }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="remark-input"
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />

          <button className="action-btn" style={{ width: "100%", marginTop: 20 }}>Login</button>
        </form>
      </div>
    );
  }

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  /* ================= DASHBOARD ================= */
  return (
    <div className="admin-container">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="admin-title">
            <FaHome style={{ color: "#4ade80" }} /> Admin Dashboard
          </div>
          <div className="admin-subtitle">Overview of house status and requests</div>
        </div>
        <button className="action-btn reject-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div
          className="stat-card blue"
          onClick={() => setActiveTab("all_houses")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Total Houses</div>
          <div className="stat-value">{approvedProperties.length}</div>
        </div>
        <div
          className="stat-card green"
          onClick={() => setActiveTab("vacant_houses")}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Vacant Houses</div>
          <div className="stat-value">{approvedProperties.length}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-label">Booked Houses</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{requests.length + properties.length}</div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "properties" ? "active" : ""}`}
          onClick={() => setActiveTab("properties")}
        >
          Recent House Requests
        </button>
        <button
          className={`tab-btn ${activeTab === "landlords" ? "active" : ""}`}
          onClick={() => setActiveTab("landlords")}
        >
          Landlord Requests
        </button>
      </div>

      {activeTab === "properties" && (
        <>
          <h3 className="section-title">Recent House Requests</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>House ID</th>
                  <th>Landlord Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr key={p.id}>
                    <td>H{p.id}</td>
                    <td>{p.title || "Landlord Name"}</td>
                    <td><span className="status-badge pending">Pending</span></td>
                    <td>
                      <button className="action-btn" onClick={() => handleApproveProperty(p.id)}>Approve</button>
                      <button className="action-btn reject-btn" onClick={() => handleRejectProperty(p.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
                {properties.length === 0 && (
                  <tr><td colSpan="4" className="no-data">No pending properties</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === "landlords" && (
        <>
          <h3 className="section-title">Landlord Requests</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.username}</td>
                    <td>
                      <button className="action-btn" onClick={() => handleApprove(r.id)}>Approve</button>
                      <button className="action-btn reject-btn" onClick={() => handleReject(r.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan="3" className="no-data">No pending requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(activeTab === "all_houses" || activeTab === "vacant_houses") && (
        <>
          <h3 className="section-title">
            {activeTab === "all_houses" ? "Total Approved Houses" : "Vacant Houses"}
          </h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>House ID</th>
                  <th>Title</th>
                  <th>Address</th>
                  <th>Rent</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {approvedProperties.map((p) => (
                  <tr key={p.id}>
                    <td>H{p.id}</td>
                    <td>{p.title}</td>
                    <td>{p.address}</td>
                    <td>₹{p.rentPrice}</td>
                    <td>
                      <span className="status-badge vacant">Approved</span>
                    </td>
                  </tr>
                ))}
                {approvedProperties.length === 0 && (
                  <tr><td colSpan="5" className="no-data">No data available</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedId && (
        <div className="remark-container">
          <textarea
            placeholder="Rejection remark"
            className="remark-input"
            value={remarkInput}
            onChange={(e) => setRemarkInput(e.target.value)}
          />
          <button className="action-btn reject-btn" onClick={confirmReject}>
            Submit Remark
          </button>
        </div>
      )}
    </div>
  );
}



