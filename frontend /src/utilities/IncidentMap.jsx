import Footer from "../components/footer/Footer";
import Header from "../components/header/Header";
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const RADIUS_KM = 20;
const FIXED_ZOOM = 10;

function DisableInteractions() {
  const map = useMap();
  useEffect(() => {
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.keyboard.disable();
  }, [map]);
  return null;
}

function IncidentMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [incidents, setIncidents] = useState([]);

  // Get location once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.error("Geolocation error code:", err.code, err.message);
        if (err.code === err.TIMEOUT) {
          console.warn("GPS timed out. Falling back to default location.");
          setUserLocation([-13.9657, 33.774]); // Default to Lilongwe Center
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  // Load incidents
  useEffect(() => {
    if (!userLocation) return;
    const [lat, long] = userLocation;

    async function getNearbyIncidents() {
      const req = await fetch(`/incident/nearby/?lat=${lat}&lon=${long}`, {
        credentials: "include",
      });
      const res = await req.json();
      if (res.success) setIncidents(res.incidents);
    }
    getNearbyIncidents();
  }, [userLocation]);

  if (!userLocation) return <p>Getting your location…</p>;

  return (
    <>
      <Header />
      <div
        style={{
          position: "relative",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          marginTop: "76px",
        }}
      >
        {/* Map fills the entire screen */}
        <MapContainer
          center={userLocation}
          zoom={FIXED_ZOOM}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DisableInteractions />
          <Circle
            center={userLocation}
            radius={RADIUS_KM * 1000}
            color="blue"
            fillOpacity={0.1}
          />
          {incidents.map((inc) => (
            <Marker key={inc.id} position={inc.coordinates}>
              <Popup>{inc.title}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <Footer />
    </>
  );
}

export default IncidentMap;
