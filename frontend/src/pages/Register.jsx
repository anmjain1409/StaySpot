import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

import bgImg from "../assets/bg-auth.jpg";
import houseImg from "../assets/auth-house.jpg";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await authService.register(
        form.username,
        form.email,
        form.password,
        form.fullName
      );

      // ✅ REGISTER SUCCESS → LOGIN PAGE
      if (res.token) {
        navigate("/login");
      }
    } catch (err) {
      setErrorMsg(err.message || "Registration failed");
    }
  };

  return (
    <div style={pageStyle(bgImg)}>
      <div style={blurOverlay} />

      <div style={cardStyle}>
        <div style={leftImage(houseImg)}>
          <h2>Manage Properties Efficiently</h2>
          <p>Easy registration & smart rental management with StaySpot</p>
        </div>

        <div style={formWrap}>
          <h2>Register</h2>

          {errorMsg && <p style={errorText}>{errorMsg}</p>}

          <form onSubmit={handleSubmit} style={formStyle}>
            <input
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />

            <button type="submit" style={buttonStyle}>
              Register
            </button>
          </form>

          <p style={{ marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={linkStyle}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageStyle = (bg) => ({
  minHeight: "100vh",
  backgroundImage: `url(${bg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
});

const blurOverlay = {
  position: "absolute",
  inset: 0,
  backdropFilter: "blur(10px)",
  background: "rgba(0,0,0,0.35)",
};

const cardStyle = {
  position: "relative",
  zIndex: 2,
  width: "900px",
  display: "flex",
  background: "#fff",
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 30px 70px rgba(0,0,0,0.4)",
};

const leftImage = (img) => ({
  width: "45%",
  backgroundImage: `url(${img})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
});

const formWrap = {
  width: "55%",
  padding: "50px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  marginTop: "20px",
};

const inputStyle = {
  padding: "14px 16px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "14px",
  borderRadius: "12px",
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  cursor: "pointer",
};

const linkStyle = {
  color: "#2563eb",
  fontWeight: "500",
  textDecoration: "none",
};

const errorText = {
  color: "#dc2626",
  marginTop: "10px",
};
