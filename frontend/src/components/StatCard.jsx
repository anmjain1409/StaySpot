export default function StatCard({ title, value, color }) {
  return (
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "15px",
      width: "200px",
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
    }}>
      <p style={{ opacity: 0.6 }}>{title}</p>
      <h2 style={{ color }}>{value}</h2>
    </div>
  );
}
