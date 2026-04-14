import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // Landing page pe navbar transparent
  const isLanding = location.pathname === "/";

  return (
    <nav
      style={{
        position: isLanding ? "fixed" : "relative",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 50,
        padding: "20px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: isLanding ? "#fff" : "#000",
        flexWrap: "wrap",
        gap: "30px",
      }}
    >
      {/* Logo */}
      <h2 style={{ fontWeight: "bold", fontSize: "22px", whiteSpace: "nowrap" }}>
        StaySpot 🏠
      </h2>

      {/* Links */}
      <div style={{ 
        display: "flex", 
        gap: "30px", 
        alignItems: "center",
        flexWrap: "wrap",
        flex: 1,
        justifyContent: "flex-end"
      }}>
        <Link
          to="/login"
          style={{
            color: isLanding ? "#fff" : "#000",
            textDecoration: "none",
            fontWeight: 600,
            whiteSpace: "nowrap"
          }}
        >
          Login
        </Link>

        <Link
          to="/register"
          style={{
            background: isLanding ? "#fff" : "#0F172A",
            color: isLanding ? "#000" : "#fff",
            padding: "8px 18px",
            borderRadius: "20px",
            textDecoration: "none",
            fontWeight: 600,
            whiteSpace: "nowrap"
          }}
        >
          Register
        </Link>
      </div>
    </nav>
  );
}
