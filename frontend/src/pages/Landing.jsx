import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import heroHouse from "../assets/hero-house.jpg";
import pageBg from "../assets/page-jsg.jpg";
import howBg from "../assets/how-bg.jpg";
import { authService } from "../services/api"; // Ensure authService is imported if needed for logout, or just clear LS

export default function Landing() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/");
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    /* ================= PAGE BACKGROUND IMAGE ================= */
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${pageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Soft overlay so content readable rahe */}
      <div
        style={{
          minHeight: "100vh",
          background: "rgba(245, 242, 235, 0.92)",
        }}
      >

        {/* ================= PILL NAVBAR ================= */}
        <div
          style={{
            position: "fixed",
            top: "25px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            background: "#2b5c7e",
            padding: "8px",
            borderRadius: "30px",
            display: "flex",
            gap: "6px",
          }}
        >
          {[
            { name: "Home", id: "home" },
            { name: "About", id: "about" },
            { name: "How it works", id: "how" },
            { name: "Pricing", id: "pricing" },
          ].map((item, i) => (
            <span
              key={i}
              onClick={() => scrollTo(item.id)}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                background: item.name === "Home" ? "#fff" : "transparent",
                color: item.name === "Home" ? "#000" : "#e6f0f7",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </span>
          ))}
        </div>

        {/* ================= AUTH BUTTONS (TOP RIGHT) ================= */}
        <div
          style={{
            position: "fixed",
            top: "25px",
            right: "5%",
            zIndex: 100,
            display: "flex",
            gap: "10px",
          }}
        >
          {!user ? (
            <>
              <Link to="/login" style={navBtnStyle}>Login</Link>
              <Link to="/register" style={{ ...navBtnStyle, background: "#2b5c7e", color: "#fff", border: "none" }}>Register</Link>
            </>
          ) : (
            <>
              {user.role === "USER" && (
                <>
                  <Link to="/landlord-form" style={navBtnStyle}>Become Landlord</Link>
                  <Link to="/landlord-status" style={navBtnStyle}>Check Status</Link>
                </>
              )}
              {user.role === "LANDLORD" && (
                <Link to="/add-property" style={navBtnStyle}>Add Property</Link>
              )}
              {user.role === "ADMIN" && (
                <Link to="/admin" style={navBtnStyle}>Dashboard</Link>
              )}
              <button onClick={handleLogout} style={{ ...navBtnStyle, background: "#ef4444", color: "#fff", border: "none", cursor: "pointer" }}>
                Logout
              </button>
            </>
          )}
        </div>

        {/* ================= HERO ================= */}
        <section
          id="home"
          style={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "1200px",
              borderRadius: "30px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
            }}
          >
            <img
              src={heroHouse}
              alt="StaySpot"
              style={{ width: "100%", height: "520px", objectFit: "cover" }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: "60px",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <p style={{ letterSpacing: "3px", textTransform: "uppercase" }}>
                Available Homes
              </p>

              <h1 style={{ fontSize: "48px", margin: "15px 0" }}>
                Plan Your <br /> Stay with Ease
              </h1>

              <p style={{ maxWidth: "420px", opacity: 0.9 }}>
                Discover vacant houses in your colony, connect with house owners
                and manage rentals easily with StaySpot.
              </p>

              <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
                <Link
                  to="/properties" // Default action
                  style={{ ...navBtnStyle, background: "#fff", color: "#000", padding: "12px 28px", fontSize: "16px" }}
                >
                  Explore Homes
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ABOUT ================= */}
        <section id="about" style={{ padding: "100px 15%", textAlign: "center" }}>
          <h2>About StaySpot</h2>
          <p style={{ marginTop: "20px", fontSize: "18px", opacity: 0.8 }}>
            StaySpot helps you discover vacant houses, connect with landlords,
            and manage rentals digitally in one platform.
          </p>
        </section>

        {/* ================= HOW IT WORKS (WITH IMAGE) ================= */}
        <section
          id="how"
          style={{
            padding: "120px 10%",
            backgroundImage: `url(${howBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* white overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.9)",
            }}
          />

          <div style={{ position: "relative" }}>
            <h2 style={{ textAlign: "center" }}>How it works</h2>

            <div
              style={{
                marginTop: "50px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "30px",
                textAlign: "center",
              }}
            >
              <div>📝 <h4>Register</h4><p>Create your account</p></div>
              <div>🏠 <h4>Explore</h4><p>Find vacant houses</p></div>
              <div>📞 <h4>Connect</h4><p>Talk to owners</p></div>
              <div>✅ <h4>Rent</h4><p>Finalize property</p></div>
            </div>
          </div>
        </section>

        {/* ================= PRICING ================= */}
        <section id="pricing" style={{ padding: "100px 10%", textAlign: "center" }}>
          <h2>Pricing</h2>

          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              gap: "30px",
              flexWrap: "wrap",
            }}
          >
            {[
              { plan: "Free", price: "₹0" },
              { plan: "Basic", price: "₹499" },
              { plan: "Premium", price: "₹999" },
            ].map((p, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  padding: "30px",
                  borderRadius: "20px",
                  width: "220px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{p.plan}</h3>
                <p style={{ fontSize: "24px", fontWeight: "bold" }}>{p.price}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
const navBtnStyle = {
  background: "rgba(255, 255, 255, 0.9)",
  color: "#333",
  padding: "8px 18px",
  borderRadius: "20px",
  fontWeight: "600",
  fontSize: "14px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  border: "1px solid #ddd",
  transition: "all 0.2s",
};
