import { useEffect, useState } from "react";

export default function LandlordStatus() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("landlordStatus");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  if (!data) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>
      No Request Found
    </h2>
  }

  const statusColor =
    data.status === "Approved" ? "green" :
    data.status === "Rejected" ? "red" : "orange";

  return (
    <div className="page-center">
      <div className="card-glass">
        <h2>Status Check</h2>
        <p><b>Name:</b> {data.name}</p>

        <p style={{ fontSize: "22px", fontWeight: "700", color: statusColor }}>
          {data.status}
        </p>

        {data.remark && (
          <p style={{ color: "red", marginTop: "10px" }}>
            <b>Remark:</b> {data.remark}
          </p>
        )}
      </div>
    </div>
  );
}
