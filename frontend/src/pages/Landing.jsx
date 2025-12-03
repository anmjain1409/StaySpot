import { Link } from "react-router-dom";

const cardStyle = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(12px)",
  padding: "40px 50px",
  borderRadius: "20px",
  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
  maxWidth: "650px",
  width: "90%",
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

export default function Landing() {
  return (
    <div className="page-center">
      <div style={cardStyle}>
        <h1 style={{ fontSize: "42px", fontWeight: 800, color: "#0F172A" }}>
          Welcome to StaySpot 🏠
        </h1>
        <p style={{ fontSize: "18px", marginTop: "12px", color: "#1E293B" }}>
          Track vacant houses in your colony easily.
        </p>

        <div style={{ marginTop: "25px" }}>
          <Link to="/login"><button style={btnStyle}>Login</button></Link>
          <Link to="/register"><button style={{ ...btnStyle, marginLeft: "15px" }}>Register</button></Link>
        </div>
      </div>
    </div>
  );
}