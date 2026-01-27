import { Link } from "react-router-dom";
import heroHouse from "../assets/hero-house.jpg";

export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
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
        {/* Image */}
        <img
          src={heroHouse}
          alt="StaySpot Hero"
          style={{ width: "100%", height: "520px", objectFit: "cover" }}
        />

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        {/* Content */}
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
              to="/properties"
              style={{
                background: "#fff",
                color: "#000",
                padding: "12px 26px",
                borderRadius: "25px",
                fontWeight: "bold",
                textDecoration: "none",
              }}
            >
              Explore Houses →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
