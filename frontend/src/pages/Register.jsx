import { useState } from "react";
import { Link } from "react-router-dom";

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

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg("🎉 Successfully Registered! You can now Login.");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="page-center">
      <div style={cardStyle}>
        <h2 style={{ fontSize: "34px", marginBottom: "15px" }}>Create Account</h2>

        {successMsg && (
          <p style={{ color: "green", fontWeight: "600" }}>{successMsg}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input style={inputStyle} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required />
          <input style={inputStyle} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <input style={inputStyle} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />

          <button style={btnStyle}>Register</button>
        </form>

        <p style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}