import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "320px",
  borderRadius: "12px",
  overflow: "hidden",
};

const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

export default function MapPicker({ onSelect, initialPosition }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [marker, setMarker] = useState(
    initialPosition ? { lat: initialPosition.lat, lng: initialPosition.lng } : null
  );

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
  });

  const handleClick = useCallback(
    (e) => {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      const pos = { lat, lng };
      setMarker(pos);
      if (onSelect) onSelect(pos);
    },
    [onSelect]
  );

  const handleSetDefault = () => {
    const pos = { lat: 28.6139, lng: 77.2090 };
    setMarker(pos);
    if (onSelect) onSelect(pos);
  };

  if (!apiKey) {
    return (
      <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8, background: "#f9f9f9" }}>
        <p>Google Maps API key not configured. Using default location for testing.</p>
        <button type="button" onClick={handleSetDefault} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: 4 }}>
          Set Default Location (Delhi)
        </button>
        {marker && <p style={{ marginTop: 10 }}>Selected: {marker.lat.toFixed(6)}, {marker.lng.toFixed(6)}</p>}
      </div>
    );
  }

  if (loadError) return <div>Map failed to load</div>;
  if (!isLoaded) return <div>Loading map…</div>;

  return (
    <div style={{ marginTop: 12 }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || initialPosition || defaultCenter}
        zoom={marker ? 14 : 5}
        onClick={handleClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      <p style={{ fontSize: 13, color: "#52525b", marginTop: 8 }}>
        Click the map to drop a pin. The chosen coordinates will be submitted with
        the form.
      </p>
    </div>
  );
}
