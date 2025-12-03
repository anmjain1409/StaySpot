import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const cardStyle = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(12px)",
  padding: "40px 50px",
  borderRadius: "20px",
  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
  maxWidth: "450px",
  width: "90%",
};

const inputStyle = {
  padding: "12px",
  width: "100%",
  borderRadius: "6px",
  border: "1px solid #aaa",
  outline: "none",
  fontSize: "16px"
};

const btnStyle = {
  padding: "12px 22px",
  cursor: "pointer",
  borderRadius: "10px",
  border: "none",
  background: "#0F172A",
  color: "#fff",
  fontSize: "16px",
  fontWeight: 600,
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="page-center">
      <div style={cardStyle}>
        <h2 style={{ fontSize: "34px", marginBottom: "15px" }}>Login</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input style={inputStyle} name="email" type="email" placeholder="Email" required onChange={handleChange} />
          <input style={inputStyle} name="password" type="password" placeholder="Password" required onChange={handleChange} />

          <button style={btnStyle}>Login</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}