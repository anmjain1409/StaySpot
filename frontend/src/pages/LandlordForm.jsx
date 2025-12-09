import { useState } from "react";

const pageStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

const cardStyle = {
  background: "rgba(255, 255, 255, 0.50)",
  backdropFilter: "blur(14px)",
  padding: "40px",
  borderRadius: "20px",
  width: "90%",
  maxWidth: "600px",
  boxShadow: "0px 10px 35px rgba(0,0,0,0.20)",
  textAlign: "center",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1px solid #0F172A55",
  fontSize: "16px",
  outline: "none",
};

const btnStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "10px",
  marginTop: "18px",
  background: "#0F172A",
  color: "#fff",
  fontSize: "18px",
  border: "none",
  cursor: "pointer",
  transition: "0.3s",
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

    alert("Your request has been submitted successfully!");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ fontSize: "32px", color: "#0F172A", font_weight: "700" }}>
          Landlord Verification Form 📝
        </h1>
        <p style={{ fontSize: "15px", color: "#334155", marginTop: "6px" }}>
          Please provide valid information for approval process
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <input
            style={inputStyle}
            name="name"
            placeholder="Landlord Name"
            required
            onChange={handleChange}
          />

          <input
            style={inputStyle}
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
          />

          <input
            style={inputStyle}
            type="text"
            maxLength="12"
            name="aadhaar"
            placeholder="Aadhaar Number (12 Digits)"
            required
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              name="countryCode"
              style={{ ...inputStyle, maxWidth: "120px" }}
              onChange={handleChange}
            >
              <option value="+91">🇮🇳 +91</option>
              <option value="+1">🇺🇸 +1</option>
              <option value="+44">🇬🇧 +44</option>
              <option value="+61">🇦🇺 +61</option>
              <option value="+81">🇯🇵 +81</option>
            </select>

            <input
              style={{ ...inputStyle, flex: 1 }}
              type="text"
              maxLength="10"
              name="contact"
              placeholder="Mobile Number"
              required
              onChange={handleChange}
            />
          </div>

          <button style={btnStyle}>Submit ✔</button>
        </form>
      </div>
    </div>
  );
}
