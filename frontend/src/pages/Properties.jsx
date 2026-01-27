import { useEffect, useState } from "react";
import { propertyService } from "../services/api";

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getApproved()
      .then((res) => {
        setLoading(false);
        console.log("Fetched approved properties:", res);
        setProperties(Array.isArray(res) ? res : []);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
        setProperties([]);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;

  return (
    <div className="page-center">
      <div className="card-glass" style={{ textAlign: "center" }}>
        <h2>Available Properties</h2>

        {properties.length === 0 && <p>No properties available.</p>}

        {properties.map((prop) => (
          <div
            key={prop.id}
            style={{ marginTop: "20px", borderBottom: "1px solid gray", paddingBottom: "10px" }}>
            <p>
              <b>Title:</b> {prop.title}
            </p>
            <p>
              <b>Description:</b> {prop.description}
            </p>
            <p>
              <b>Address:</b> {prop.address}
            </p>
            <p>
              <b>House No:</b> {prop.houseNo}, <b>Street:</b> {prop.streetNo}
            </p>
            <p>
              <b>Rent:</b> ${prop.rentPrice}, <b>Type:</b> {prop.houseType}
            </p>
            <p>
              <b>Amenities:</b> {prop.amenities?.join(", ") || "None"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}