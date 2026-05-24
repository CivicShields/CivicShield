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

const RADIUS_KM = 2;
const FIXED_ZOOM = 15;

// Dummy incidents around [-13.9657, 33.7707]
const DUMMY_INCIDENTS = [
  {
    id: 1,
    title: "Road crack near market",
    latitude: -13.9652,
    longitude: 33.7701,
  },
  {
    id: 2,
    title: "Broken streetlight on M1",
    latitude: -13.9663,
    longitude: 33.7712,
  },
  { id: 3, title: "Water pipe burst", latitude: -13.9648, longitude: 33.7695 },
  {
    id: 4,
    title: "Illegal dumping at corner shop",
    latitude: -13.967,
    longitude: 33.7699,
  },
  {
    id: 5,
    title: "Pothole near bus stop",
    latitude: -13.9659,
    longitude: 33.772,
  },
  { id: 6, title: "Fallen signpost", latitude: -13.9645, longitude: 33.7715 },
];

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
  const [useDummy, setUseDummy] = useState(true);

  // Get location once
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        // fallback to dummy centre
        setUserLocation([-13.9657216, 33.7707008]);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  // Load incidents
  useEffect(() => {
    if (!userLocation) return;

    if (useDummy) {
      const filtered = DUMMY_INCIDENTS.filter((inc) => {
        const distKm = getDistanceKm(
          userLocation[0],
          userLocation[1],
          inc.latitude,
          inc.longitude,
        );
        return distKm <= RADIUS_KM;
      });
      setIncidents(filtered);
    } else {
      // Real API call:
      // fetch(`/api/incidents/?lat=${userLocation[0]}&lng=${userLocation[1]}&radius=${RADIUS_KM}`)
      //   .then(res => res.json())
      //   .then(data => setIncidents(data));
    }
  }, [userLocation, useDummy]);

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
            <Marker key={inc.id} position={[inc.latitude, inc.longitude]}>
              <Popup>{inc.title}</Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating toggle button – stays out of the way */}
        <button
          onClick={() => setUseDummy(!useDummy)}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            zIndex: 1000,
            padding: "10px 16px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          {useDummy ? "🌐 Use Real Data (API)" : "📦 Use Dummy Data"}
        </button>
      </div>
      <Footer />
    </>
  );
}

// Haversine formula (km)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default IncidentMap;
