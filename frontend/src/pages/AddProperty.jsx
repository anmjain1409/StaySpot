import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { propertyService } from "../services/api";

export default function AddProperty() {
  console.log("AddProperty component rendered");
  const [form, setForm] = useState({
    title: "",
    description: "",
    address: "",
    houseNo: "",
    streetNo: "",
    rentPrice: "",
    houseType: "",
    amenities: [],
    latitude: null,
    longitude: null,
  });
  const [loading, setLoading] = useState(false);
  const [amenityInput, setAmenityInput] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !form.amenities.includes(amenityInput.trim())) {
      setForm({ ...form, amenities: [...form.amenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (amenity) => {
    setForm({ ...form, amenities: form.amenities.filter(a => a !== amenity) });
  };

  const handleLocationSelect = (pos) => {
    setForm({ ...form, latitude: pos.lat, longitude: pos.lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userJson = localStorage.getItem("user");
    const user = userJson ? JSON.parse(userJson) : null;
    if (!user || user.role !== "LANDLORD") {
      alert("You must be an approved landlord to add a property.");
      return;
    }
    if (!form.latitude || !form.longitude) {
      // For testing, set default location if map not working
      setForm({ ...form, latitude: 28.6139, longitude: 77.2090 });
      // alert("Please select a location on the map.");
      // return;
    }
    setLoading(true);
    try {
      const data = {
        ownerUsername: user?.username,
        title: form.title,
        description: form.description,
        address: form.address,
        houseNo: form.houseNo,
        streetNo: form.streetNo,
        rentPrice: parseFloat(form.rentPrice),
        houseType: form.houseType,
        amenities: form.amenities,
        latitude: form.latitude,
        longitude: form.longitude,
      };
      console.log("Submitting property:", data);
      const res = await propertyService.create(data);
      console.log("Property created:", res);
      setLoading(false);
      alert("Property added and sent for admin approval");
      navigate("/dashboard");
    } catch (err) {
      console.error("Error adding property:", err);
      setLoading(false);
      alert(err.message || "Failed to add property");
    }
  };

  return (
    <div className="page-center">
      <div className="card-glass" style={{ textAlign: "left", maxWidth: "800px" }}>
        <h2 style={{ marginBottom: 20 }}>Add Property</h2>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "15px" }}>
        <div>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Title</label>
          <input name="title" required onChange={handleChange} value={form.title} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Description</label>
          <textarea name="description" required onChange={handleChange} value={form.description} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", minHeight: "80px" }} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Address</label>
          <input name="address" required onChange={handleChange} value={form.address} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>House No</label>
            <input name="houseNo" required onChange={handleChange} value={form.houseNo} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Street No</label>
            <input name="streetNo" required onChange={handleChange} value={form.streetNo} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Rent Price</label>
            <input name="rentPrice" type="number" step="0.01" required onChange={handleChange} value={form.rentPrice} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>House Type</label>
            <select name="houseType" required onChange={handleChange} value={form.houseType} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}>
              <option value="">Select Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Studio">Studio</option>
            </select>
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Amenities</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <input
              value={amenityInput}
              onChange={(e) => setAmenityInput(e.target.value)}
              placeholder="Add amenity"
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
            />
            <button type="button" onClick={handleAddAmenity} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {form.amenities.map((amenity, index) => (
              <span key={index} style={{ padding: "5px 10px", background: "#f0f0f0", borderRadius: 5, display: "flex", alignItems: "center", gap: 5 }}>
                {amenity} <button type="button" onClick={() => handleRemoveAmenity(amenity)} style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}>x</button>
              </span>
            ))}
          </div>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>Select Location</label>
          <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8, background: "#f9f9f9" }}>
            <p>Using default location for testing.</p>
            <button type="button" onClick={() => handleLocationSelect({ lat: 28.6139, lng: 77.2090 })} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
              Set Default Location (Delhi)
            </button>
            {form.latitude && form.longitude && (
              <p style={{ marginTop: 10 }}>Selected: {form.latitude.toFixed(6)}, {form.longitude.toFixed(6)}</p>
            )}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button type="submit" style={{ padding: "12px 30px", background: "#28a745", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px" }}>{loading ? "Adding..." : "Add Property"}</button>
        </div>
        </form>
      </div>
    </div>
  );
}
