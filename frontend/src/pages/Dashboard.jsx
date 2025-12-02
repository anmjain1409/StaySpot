const cardStyle = {
  background: "rgba(255, 255, 255, 0.65)",
  backdropFilter: "blur(12px)",
  padding: "40px 50px",
  borderRadius: "20px",
  boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
  maxWidth: "650px",
  width: "90%",
  textAlign: "center"
};

export default function Dashboard() {
  return (
    <div className="page-center">
      <div style={cardStyle}>
        <h1 style={{ fontSize: "42px", fontWeight: 700, color: "#0F172A" }}>
          Welcome 👋
        </h1>
      </div>
    </div>
  );
}
