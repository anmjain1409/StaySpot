import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { landlordService } from "../services/api";
import { FaUser, FaMapMarkerAlt, FaIdCard } from "react-icons/fa";
import bgImg from "../images/bg-img.PNG"; // Imported background image

const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundImage: `url(${bgImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.6)",
  backdropFilter: "blur(12px)",
  padding: "40px",
  borderRadius: "20px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0px 8px 32px rgba(31, 38, 135, 0.37)",
  textAlign: "center",
  border: "1px solid rgba(255, 255, 255, 0.4)",
};

const inputContainerStyle = {
  position: "relative",
  marginBottom: "15px",
};

const iconStyle = {
  position: "absolute",
  top: "50%",
  left: "15px",
  transform: "translateY(-50%)",
  color: "#555",
  fontSize: "18px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 14px 14px 45px", // Left padding for icon
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.1)",
  fontSize: "16px",
  outline: "none",
  background: "#fff",
  color: "#333",
  boxSizing: "border-box", // Ensure matches container
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "8px",
  marginTop: "10px",
  background: "linear-gradient(135deg, #4F7942 0%, #6B8E23 100%)", // Green gradient
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
};

export default function LandlordForm() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    aadhaar: "",
    contact: "",
    countryCode: "+91",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!/^\d{12}$/.test(form.aadhaar)) {
      alert("Aadhaar must be exactly 12 digits.");
      return false;
    }

    if (!/^\d{10}$/.test(form.contact)) {
      alert("Mobile number must be 10 digits.");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    const username = user?.username;

    if (!username) {
      alert("You must be logged in to submit a landlord request.");
      return;
    }

    setLoading(true);
    landlordService
      .submitRequest({
        username,
        name: form.name,
        address: form.address,
        aadhaar: form.aadhaar,
        contact: form.contact,
        countryCode: form.countryCode,
      })
      .then((res) => {
        setLoading(false);
        // store last request id so status page can show quickly
        if (res && res.id) localStorage.setItem("lastLandlordRequestId", res.id);
        navigate("/landlord-status");
      })
      .catch((err) => {
        setLoading(false);
        alert(err.message || "Failed to submit request");
      });
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "32px", color: "#0F172A", font_weight: "700" }}>
          Landlord Verification Form
        </h1>
        <p style={{ fontSize: "15px", color: "#334155", marginTop: "6px" }}>
          Please provide valid information for approval process
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>

          {/* Name Field */}
          <div style={inputContainerStyle}>
            <FaUser style={iconStyle} />
            <input
              style={inputStyle}
              name="name"
              placeholder="Landlord Name"
              required
              onChange={handleChange}
            />
          </div>

          {/* Address Field */}
          <div style={inputContainerStyle}>
            <FaMapMarkerAlt style={iconStyle} />
            <input
              style={inputStyle}
              name="address"
              placeholder="Address"
              required
              onChange={handleChange}
            />
          </div>

          {/* Aadhaar Field */}
          <div style={inputContainerStyle}>
            <FaIdCard style={iconStyle} />
            <input
              style={inputStyle}
              type="text"
              maxLength="12"
              name="aadhaar"
              placeholder="Aadhaar Number (12 Digits)"
              required
              onChange={handleChange}
            />
          </div>

          {/* Contact Field */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <div style={{ position: "relative", flex: "0 0 100px" }}>
              <select
                name="countryCode"
                style={{ ...inputStyle, padding: "14px", paddingLeft: "10px", textAlign: "center" }}
                onChange={handleChange}
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+61">🇦🇺 +61</option>
                <option value="+81">🇯🇵 +81</option>
              </select>
            </div>

            <div style={{ position: "relative", flex: 1 }}>
              <input
                style={{ ...inputStyle, paddingLeft: "15px" }} // No icon in this specific input
                type="text"
                maxLength="10"
                name="contact"
                placeholder="Mobile Number"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <button style={btnStyle} disabled={loading}>
            {loading ? "Submitting..." : "Submit ✔"}
          </button>
        </form>
      </div>
    </div>
  );
}
