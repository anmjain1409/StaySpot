export default function AdminSidebar() {
  return (
    <div style={{
      width: "240px",
      background: "#1e293b",
      color: "#fff",
      height: "100vh",
      padding: "20px",
      position: "fixed",
      left: 0,
      top: 0
    }}>
      <h2 style={{ marginBottom: "30px" }}>🏠 HouseVacancy</h2>

      {[
        "Dashboard",
        "Vacancy Management",
        "Pending Approvals",
        "Approved Vacancies",
        "Rejected Vacancies",
        "User Management",
        "Cities / Locations",
        "Reports",
        "Settings",
        "Logout"
      ].map((item, i) => (
        <div
          key={i}
          style={{
            padding: "10px",
            marginBottom: "6px",
            borderRadius: "8px",
            cursor: "pointer",
            background: item === "Vacancy Management" ? "#2563eb" : "transparent"
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
