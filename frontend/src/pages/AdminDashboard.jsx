import { useEffect, useState } from "react";
import { FaHome, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa"; // Added icons
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
  const [selectedDetails, setSelectedDetails] = useState(null); // Landlord details modal
  const [selectedPropertyDetails, setSelectedPropertyDetails] = useState(null); // Property details modal
  const [rejectType, setRejectType] = useState(null); // "landlord" or "property"
  const [loading, setLoading] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("adminTheme") === "dark";
  });
  const [bookedHousesCount, setBookedHousesCount] = useState(0);
  const [bookedHouses, setBookedHouses] = useState([]);
  const [vacantHouses, setVacantHouses] = useState([]);

  /* ================= CHECK ADMIN & THEME ================= */
  useEffect(() => {
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (user && user.role === "ADMIN") {
      setAdminLoggedIn(true);
      fetchPending();
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("adminTheme", newMode ? "dark" : "light");
  };

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

    // Fetch booked houses count
    const token = localStorage.getItem("authToken");
    fetch(`${API_BASE_URL}/bookings/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookedHousesCount(data.bookedHouses || 0))
      .catch(() => setBookedHousesCount(0));
  };

  const fetchBookedHouses = () => {
    const token = localStorage.getItem("authToken");
    fetch(`${API_BASE_URL}/bookings/booked-houses`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setBookedHouses(Array.isArray(data) ? data : []))
      .catch(() => setBookedHouses([]));
  };

  const fetchVacantHouses = () => {
    const token = localStorage.getItem("authToken");
    fetch(`${API_BASE_URL}/bookings/vacant-houses`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setVacantHouses(Array.isArray(data) ? data : []))
      .catch(() => setVacantHouses([]));
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
    landlordService.approve(id).then(() => {
      alert("Landlord Request Approved Successfully");
      fetchPending();
    });

  const handleReject = (id) => {
    setSelectedId(id);
    setRejectType("landlord");
  };

  const confirmReject = () => {
    if (rejectType === "landlord") {
      landlordService.reject(selectedId, remarkInput).then(() => {
        alert("Landlord Request Rejected with Remark");
        setRemarkInput("");
        setSelectedId(null);
        setRejectType(null);
        fetchPending();
      });
    } else if (rejectType === "property") {
      propertyService.reject(selectedId, remarkInput).then(() => {
        alert("Property Rejected with Remark");
        setRemarkInput("");
        setSelectedId(null);
        setRejectType(null);
        fetchPending();
      });
    }
  };

  /* ================= PROPERTY ACTIONS ================= */
  const handleApproveProperty = (id) =>
    propertyService.approve(id).then(() => {
      alert("Property Approved Successfully");
      fetchPending();
    });

  const handleRejectProperty = (id) => {
    setSelectedId(id);
    setRejectType("property");
  };

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
    <div className={`admin-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="admin-title">
            <FaHome style={{ color: "#4ade80" }} /> Admin Dashboard
          </div>
          <div className="admin-subtitle">Overview of house status and requests</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="action-btn reject-btn" onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div
          className={`stat-card blue ${activeTab === "all_houses" ? "selected" : ""}`}
          onClick={() => { setActiveTab("all_houses"); setShowRequests(false); }}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Total Houses</div>
          <div className="stat-value">{approvedProperties.length}</div>
        </div>
        <div
          className={`stat-card green ${activeTab === "vacant_houses" ? "selected" : ""}`}
          onClick={() => { setActiveTab("vacant_houses"); setShowRequests(false); fetchVacantHouses(); }}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Vacant Houses</div>
          <div className="stat-value">{approvedProperties.length - bookedHousesCount}</div>
        </div>
        <div
          className={`stat-card red ${activeTab === "booked_houses" ? "selected" : ""}`}
          onClick={() => { setActiveTab("booked_houses"); setShowRequests(false); fetchBookedHouses(); }}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Booked Houses</div>
          <div className="stat-value">{bookedHousesCount}</div>
        </div>
        <div
          className={`stat-card yellow ${showRequests ? "selected" : ""}`}
          onClick={() => { setShowRequests(true); setActiveTab(null); }}
          style={{ cursor: "pointer" }}
        >
          <div className="stat-label">Pending Requests</div>
          <div className="stat-value">{requests.length + properties.length}</div>
        </div>
      </div>

      {showRequests && (
        <>
          <div className="tabs">
            <button
              className={`tab-btn ${activeTab === "landlords" ? "active" : ""}`}
              onClick={() => setActiveTab("landlords")}
            >
              Landlord Requests
            </button>
            <button
              className={`tab-btn ${activeTab === "properties" ? "active" : ""}`}
              onClick={() => setActiveTab("properties")}
            >
              House Requests
            </button>
          </div>

          {activeTab === "landlords" && (
            <>
              <h3 className="section-title">Landlord Requests</h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr key={r.id}>
                        <td>{r.name}</td>
                        <td>{r.username}</td>
                        <td><span className="status-badge pending">Pending</span></td>
                        <td>
                          <button className="action-btn details-btn" onClick={() => setSelectedDetails(r)}>Details</button>
                          <button className="action-btn" onClick={() => handleApprove(r.id)}>Approve</button>
                          <button className="action-btn reject-btn" onClick={() => handleReject(r.id)}>Reject</button>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr><td colSpan="5" className="no-data">No pending requests</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === "properties" && (
            <>
              <h3 className="section-title">House Requests</h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>House Title</th>
                      <th>House Type</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id}>
                        <td>{p.title || "No Title"}</td>
                        <td>{p.houseType}</td>
                        <td><span className="status-badge pending">Pending</span></td>
                        <td>
                          <button className="action-btn details-btn" onClick={() => setSelectedPropertyDetails(p)}>Details</button>
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
        </>
      )}

      {
        (activeTab === "all_houses" || activeTab === "vacant_houses") && (
          <>
            <h3 className="section-title">
              {activeTab === "all_houses" ? "Total Approved Houses" : "Vacant Houses"}
            </h3>
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Landlord Name</th>
                    <th>House Number</th>
                    <th>Street No.</th>
                    <th>House Type</th>
                    <th>Rent</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTab === "all_houses" ? approvedProperties : vacantHouses).map((p) => (
                    <tr key={p.id}>
                      <td>{p.ownerName || p.ownerUsername}</td>
                      <td>{p.houseNo}</td>
                      <td>{p.streetNo}</td>
                      <td>{p.houseType}</td>
                      <td>₹{p.rentPrice}</td>
                    </tr>
                  ))}
                  {(activeTab === "all_houses" ? approvedProperties : vacantHouses).length === 0 && (
                    <tr><td colSpan="5" className="no-data">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )
      }

      {activeTab === "booked_houses" && (
        <>
          <h3 className="section-title">Booked Houses</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Landlord Name</th>
                  <th>House Number</th>
                  <th>Street No.</th>
                  <th>House Type</th>
                  <th>Rent</th>
                </tr>
              </thead>
              <tbody>
                {bookedHouses.map((house, index) => (
                  <tr key={index}>
                    <td>{house.landlordName}</td>
                    <td>{house.houseNumber}</td>
                    <td>{house.streetNo}</td>
                    <td>{house.houseType}</td>
                    <td>₹{house.rent}</td>
                  </tr>
                ))}
                {bookedHouses.length === 0 && (
                  <tr><td colSpan="5" className="no-data">No booked houses</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Rejection Remark Modal */}
      {selectedId && (
        <div className="modal-overlay" onClick={() => { setSelectedId(null); setRejectType(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>Provide Rejection Remark</h2>
              <button className="modal-close" onClick={() => { setSelectedId(null); setRejectType(null); }}>&times;</button>
            </div>
            <div className="remark-container" style={{ marginTop: 0, background: 'transparent', padding: 0 }}>
              <textarea
                placeholder="Enter the reason for rejection..."
                className="remark-input"
                style={{ minHeight: '120px', marginBottom: '1.5rem' }}
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
              />
              <button
                className="action-btn reject-btn"
                style={{ width: '100%', padding: '0.75rem' }}
                onClick={confirmReject}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Landlord Details Modal */}
      {
        selectedDetails && (
          <div className="modal-overlay" onClick={() => setSelectedDetails(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 style={{ margin: 0 }}>Request Details</h2>
                <button className="modal-close" onClick={() => setSelectedDetails(null)}>&times;</button>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Username</span>
                  <span className="detail-value">{selectedDetails.username}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{selectedDetails.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{selectedDetails.address}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Aadhaar Number</span>
                  <span className="detail-value">{selectedDetails.aadhaar}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact Number</span>
                  <span className="detail-value">{selectedDetails.countryCode} {selectedDetails.contact}</span>
                </div>

              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                  className="action-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleApprove(selectedDetails.id);
                    setSelectedDetails(null);
                  }}
                >
                  Approve
                </button>
                <button
                  className="action-btn reject-btn"
                  style={{ flex: 1 }}
                  onClick={() => {
                    handleReject(selectedDetails.id);
                    setSelectedDetails(null);
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Property Details Modal */}
      {selectedPropertyDetails && (
        <div className="modal-overlay" onClick={() => setSelectedPropertyDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 style={{ margin: 0 }}>House Request Details</h2>
              <button className="modal-close" onClick={() => setSelectedPropertyDetails(null)}>&times;</button>
            </div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Owner</span>
                <span className="detail-value">{selectedPropertyDetails.ownerName || selectedPropertyDetails.ownerUsername}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Title</span>
                <span className="detail-value">{selectedPropertyDetails.title || "No Title"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type</span>
                <span className="detail-value">{selectedPropertyDetails.houseType}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rent Price</span>
                <span className="detail-value">₹{selectedPropertyDetails.rentPrice}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Address</span>
                <span className="detail-value">{selectedPropertyDetails.address}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">House/Street No</span>
                <span className="detail-value">
                  {selectedPropertyDetails.houseNo}, {selectedPropertyDetails.streetNo}
                </span>
              </div>
              {selectedPropertyDetails.amenities && selectedPropertyDetails.amenities.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Amenities</span>
                  <div className="detail-value" style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                    {selectedPropertyDetails.amenities.map((a, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                className="action-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  handleApproveProperty(selectedPropertyDetails.id);
                  setSelectedPropertyDetails(null);
                }}
              >
                Approve
              </button>
              <button
                className="action-btn reject-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  handleRejectProperty(selectedPropertyDetails.id);
                  setSelectedPropertyDetails(null);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}



