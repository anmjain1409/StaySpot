import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { propertyService } from "../services/api";
import bgImage from "../images/colony-bg-img.png";

export default function AddProperty() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    title: "",
    ownerName: "",
    mobileNumber: "",
    houseNo: "",
    streetNo: "",
    houseType: "",
    bhk: "",
    rentPrice: "",
    securityDeposit: "",
    furnishing: "",
    availableFrom: "",
    amenities: [],
    latitude: 28.6139,
    longitude: 77.209,
    address: "Housing Board Colony",
    images: [] // Storing base64 strings
  });

  const [amenityInput, setAmenityInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setForm((prev) => ({ ...prev, ownerName: user.fullName || "" }));
    }
    if (location.state) {
      setForm((prev) => ({ ...prev, ...location.state }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAmenityKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAmenity();
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !form.amenities.includes(amenityInput.trim())) {
      setForm({ ...form, amenities: [...form.amenities, amenityInput.trim()] });
      setAmenityInput("");
    }
  };

  const removeAmenity = (item) => {
    setForm({ ...form, amenities: form.amenities.filter((a) => a !== item) });
  };

  /* ================= AI & IMAGE HANDLERS ================= */

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const analyzeWithAI = async () => {
    let geminiKey = import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem("GEMINI_KEY");

    if (!geminiKey) {
      const key = prompt("Please enter your Gemini API Key to use this feature:");
      if (key) {
        localStorage.setItem("GEMINI_KEY", key);
        geminiKey = key;
      } else {
        return;
      }
    }

    setLoadingAI(true);
    // Models to try in order of preference
    const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-pro-vision"];
    let lastError = null;

    for (const modelId of models) {
      try {
        console.log(`Trying AI with model: ${modelId}`);
        const base64Images = form.images.map(img => img.split(",")[1]);
        const payload = {
          contents: [{
            parts: [
              { text: "Analyze these house photos and provide details in this JSON format ONLY: {\"houseType\": \"Independent House\" | \"Duplex\" | \"Row House\" | \"Apartment / Flat\", \"bhk\": \"STUDIO\" | \"RK\" | \"BHK1\" | \"BHK2\" | \"BHK3\" | \"BHK4\" | \"HOUSE\", \"furnishing\": \"Unfurnished\" | \"Semi-Furnished\" | \"Fully Furnished\", \"amenities\": [], \"suggestedRent\": 15000}. Return only valid JSON." },
              ...base64Images.slice(0, 3).map(data => ({ inline_data: { mime_type: "image/jpeg", data } }))
            ]
          }]
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${geminiKey}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error?.message || `Model ${modelId} failed`);
        }

        const data = await res.json();
        const textResponse = data.candidates[0].content.parts[0].text;
        const jsonStr = textResponse.replace(/```json|```/g, "").trim();
        const aiResult = JSON.parse(jsonStr);

        setForm(prev => ({
          ...prev,
          houseType: aiResult.houseType || prev.houseType,
          bhk: aiResult.bhk || prev.bhk,
          furnishing: aiResult.furnishing || prev.furnishing,
          amenities: [...new Set([...prev.amenities, ...(aiResult.amenities || [])])],
          rentPrice: aiResult.suggestedRent || prev.rentPrice
        }));

        alert(`AI suggestion applied! (Analysed using ${modelId})`);
        setLoadingAI(false);
        return; // Success! Exit the loop.
      } catch (err) {
        console.warn(`Model ${modelId} failed:`, err.message);
        lastError = err;
        // Continue to next model
      }
    }

    // If we reach here, all models failed
    setLoadingAI(false);
    alert("AI analysis failed on all available models. Error: " + lastError.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please login first");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        ownerUsername: user.username,
        rentPrice: parseFloat(form.rentPrice),
        securityDeposit: form.securityDeposit ? parseFloat(form.securityDeposit) : null,
      };
      console.log("Submitting property payload:", payload);
      await propertyService.create(payload);
      alert("Listing request submitted successfully!");
      navigate("/landlord-status");
    } catch (err) {
      console.error("Submission error:", err);
      alert(`Failed to submit request: ${err.message || "Unknown error"}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formCardStyle}>
        <header style={{ marginBottom: "30px" }}>
          <h1 style={titleStyle}>Add your property</h1>
          <p style={subtitleStyle}>List your house in Housing Board Colony</p>
        </header>

        <form onSubmit={handleSubmit}>
          {/* House Images */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>House Gallery & AI Analysis</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
              Upload photos of your house. AI can help you fill the form automatically!
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
              <label style={aiButtonStyle}>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                📷 Upload Photos
              </label>

              <button
                type="button"
                onClick={analyzeWithAI}
                disabled={form.images.length === 0 || loadingAI}
                style={{
                  ...aiButtonStyle,
                  background: form.images.length === 0 ? "#ccc" : "linear-gradient(45deg, #6366f1, #a855f7)",
                  cursor: form.images.length === 0 ? "not-allowed" : "pointer",
                }}
              >
                {loadingAI ? "🪄 AI is analyzing..." : "✨ Magic Fill with AI"}
              </button>
            </div>

            {/* Image Previews */}
            <div style={imageGridStyle}>
              {form.images.map((img, idx) => (
                <div key={idx} style={imagePreviewWrapperStyle}>
                  <img src={img} alt="preview" style={imagePreviewStyle} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={imageDeleteBtnStyle}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Owner Details */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Owner Details</h3>
            <div style={gridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Owner Name <span style={{ color: "red" }}>*</span></label>
                <input
                  name="ownerName"
                  placeholder="Enter Owner Name"
                  required
                  value={form.ownerName}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Mobile Number <span style={{ color: "red" }}>*</span></label>
                <input
                  name="mobileNumber"
                  placeholder="Enter Mobile Number"
                  required
                  value={form.mobileNumber}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
            </div>
          </section>

          {/* House Details */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>House Details</h3>
            <div style={gridStyle}>
              {/* 🔥 ADD THIS */}
              <div style={inputGroupStyle}>
                <label style={labelStyle}>
                  Property Title <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  name="title"
                  placeholder="e.g. 2BHK near park"
                  required
                  value={form.title}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>House Number <span style={{ color: "red" }}>*</span></label>
                <input
                  name="houseNo"
                  placeholder="e.g. 123-A"
                  required
                  value={form.houseNo}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Street No. <span style={{ color: "red" }}>*</span></label>
                <input
                  name="streetNo"
                  placeholder="e.g. 5"
                  required
                  value={form.streetNo}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>House Type <span style={{ color: "red" }}>*</span></label>
                <select name="houseType" required value={form.houseType} onChange={handleChange} style={inputFieldStyle}>
                  <option value="">Select Type</option>
                  <option value="Independent House">Independent House</option>
                  <option value="Duplex">Duplex</option>
                  <option value="Row House">Row House</option>
                  <option value="Apartment / Flat">Apartment / Flat</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>BHK / Rooms <span style={{ color: "red" }}>*</span></label>
                <select name="bhk" required value={form.bhk} onChange={handleChange} style={inputFieldStyle}>
                  <option value="STUDIO">Studio</option>
                  <option value="RK">1 RK</option>
                  <option value="BHK1">1 BHK</option>
                  <option value="BHK2">2 BHK</option>
                  <option value="BHK3">3 BHK</option>
                  <option value="BHK4">4 BHK</option>
                  <option value="HOUSE">House</option>
                </select>
              </div>
            </div>
          </section>

          {/* Rent Details */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Rent Details</h3>
            <div style={gridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Monthly Rent (₹) <span style={{ color: "red" }}>*</span></label>
                <input
                  name="rentPrice"
                  type="number"
                  placeholder="e.g. 15000"
                  required
                  value={form.rentPrice}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Security Deposit (₹)</label>
                <input
                  name="securityDeposit"
                  type="number"
                  placeholder="e.g. 30000"
                  value={form.securityDeposit}
                  onChange={handleChange}
                  style={inputFieldStyle}
                />
              </div>
            </div>
          </section>

          {/* House Features */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>House Features</h3>
            <div style={gridStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Furnishing <span style={{ color: "red" }}>*</span></label>
                <select name="furnishing" required value={form.furnishing} onChange={handleChange} style={inputFieldStyle}>
                  <option value="">Select Furnishing</option>
                  <option value="Unfurnished">Unfurnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                </select>
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Amenities</label>
                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                    placeholder="Type and press Enter"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={handleAmenityKeyPress}
                    style={{ ...inputFieldStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    style={secondaryButtonStyle}
                  >
                    Add
                  </button>
                </div>
                <div style={chipContainerStyle}>
                  {form.amenities.map((item, idx) => (
                    <div key={idx} style={chipStyle}>
                      {item}
                      <button
                        type="button"
                        onClick={() => removeAmenity(item)}
                        style={chipRemoveBtnStyle}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Availability */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Availability</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Available From <span style={{ color: "red" }}>*</span></label>
              <input
                name="availableFrom"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={form.availableFrom}
                onChange={handleChange}
                style={{ ...inputFieldStyle, maxWidth: "300px" }}
              />
            </div>
          </section>

          {/* Location */}
          <section style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Location (Colony-Locked)</h3>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "10px" }}>
              Only houses in this colony are allowed. Using default location for testing.
            </p>
            <div style={mapPlaceholderStyle}>
              <div style={pinStyle}>📍</div>
              <div style={colonyLabelStyle}>Housing Board Colony</div>
              <p style={{ position: "absolute", bottom: "10px", left: "10px", fontSize: "10px", color: "#999" }}>
                Map centered at: 28.6139, 77.209
              </p>
            </div>
          </section>

          <button type="submit" disabled={loading} style={primaryButtonStyle}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "100vh",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  padding: "40px 20px",
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const formCardStyle = {
  backgroundColor: "#ffffff",
  maxWidth: "900px",
  width: "100%",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  border: "1px solid #eaeaea",
};

const titleStyle = {
  fontSize: "28px",
  color: "#333",
  margin: "0 0 8px 0",
};

const subtitleStyle = {
  fontSize: "16px",
  color: "#666",
  margin: 0,
};

const sectionStyle = {
  marginBottom: "35px",
};

const sectionTitleStyle = {
  fontSize: "18px",
  color: "#444",
  borderBottom: "1px solid #f0f0f0",
  paddingBottom: "10px",
  marginBottom: "20px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#555",
};

const inputFieldStyle = {
  padding: "12px 16px",
  borderRadius: "8px",
  border: "1px solid #ced4da",
  fontSize: "15px",
  outline: "none",
  transition: "border-color 0.2s",
  backgroundColor: "#fafafa",
};

const chipContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginTop: "15px",
};

const chipStyle = {
  backgroundColor: "#e7f1ff",
  color: "#007bff",
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  border: "1px solid #cfe2ff",
};

const chipRemoveBtnStyle = {
  background: "none",
  border: "none",
  color: "#007bff",
  fontSize: "18px",
  cursor: "pointer",
  lineHeight: 1,
  padding: 0,
};

const mapPlaceholderStyle = {
  height: "250px",
  backgroundColor: "#eef2f5",
  borderRadius: "12px",
  border: "1px solid #dde1e5",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  backgroundImage: "radial-gradient(#d1d1d1 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

const pinStyle = {
  fontSize: "40px",
  marginBottom: "10px",
  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
};

const colonyLabelStyle = {
  background: "white",
  padding: "5px 15px",
  borderRadius: "20px",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  color: "#333",
};

const primaryButtonStyle = {
  backgroundColor: "#28a745",
  color: "white",
  padding: "15px 30px",
  borderRadius: "10px",
  border: "none",
  fontSize: "18px",
  fontWeight: "600",
  cursor: "pointer",
  width: "100%",
  marginTop: "20px",
  transition: "background-color 0.2s",
};

const secondaryButtonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 25px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "500",
  cursor: "pointer",
};

const aiButtonStyle = {
  padding: "12px 24px",
  borderRadius: "10px",
  border: "none",
  color: "#fff",
  fontWeight: "600",
  fontSize: "15px",
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: "linear-gradient(45deg, #4f46e5, #7c3aed)",
  boxShadow: "0 4px 15px rgba(99, 102, 241, 0.3)",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const imageGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
  gap: "15px",
  marginTop: "20px",
};

const imagePreviewWrapperStyle = {
  position: "relative",
  aspectRatio: "1",
  borderRadius: "12px",
  overflow: "hidden",
  border: "2px solid #eee",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const imagePreviewStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const imageDeleteBtnStyle = {
  position: "absolute",
  top: "5px",
  right: "5px",
  width: "24px",
  height: "24px",
  borderRadius: "12px",
  background: "rgba(239, 68, 68, 0.9)",
  color: "white",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
};

const aiKeyPromptStyle = {
  marginTop: "30px",
  padding: "15px",
  background: "#f8fafc",
  borderRadius: "12px",
  border: "1px dashed #cbd5e1",
  textAlign: "center",
};

