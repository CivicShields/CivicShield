// IncidentMap.jsx
// Install dependencies first:
//   npm install @react-google-maps/api
//
// Usage:
//   <IncidentMap />
//
// Add your Google Maps API key to .env:
//   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Circle,
  AdvancedMarkerElement,
  InfoWindow,
} from "@react-google-maps/api";

// ─── CONFIG ───────────────────────────────────────────────────────────────────

const RADIUS_KM = 3; // default radius in km (user can adjust 2–5)
const RADIUS_M = RADIUS_KM * 1000;

// Map styling — dark theme to match your SafetyTrack design
const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0b1120" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8899bb" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0b1120" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#1a2845" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0b1120" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#1e4db7" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#060d1a" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] }, // hide POI clutter
  { featureType: "transit", stylers: [{ visibility: "off" }] }, // hide transit clutter
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#1e4db7" }],
  },
];

// Severity → colour mapping
const SEVERITY_COLORS = {
  critical: "#e63946",
  medium: "#f4a261",
  low: "#10b981",
};

// ─── HAVERSINE DISTANCE (km) ──────────────────────────────────────────────────
// Calculates straight-line distance between two lat/lng points.
// Used to filter incidents without hitting any API — pure maths, zero cost.

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── MOCK INCIDENT FETCHER ────────────────────────────────────────────────────
// Replace this with your real incidentService call:
//   import { incidentService } from "../services/incidentService";
//   const data = await incidentService.getByBounds(swLat, swLng, neLat, neLng);
//
// Key point: pass the map's visible bounds to your API so the backend only
// returns incidents in that geographic box — not all 200 nationwide.
// This is the bandwidth saving you want.

async function fetchIncidentsInBounds(swLat, swLng, neLat, neLng) {
  // Replace with:
  // return await incidentService.getByBounds(swLat, swLng, neLat, neLng);

  // ── MOCK DATA (Blantyre area) ──
  const mockIncidents = [
    {
      id: 1,
      lat: -15.7861,
      lng: 35.0058,
      type: "Fire",
      severity: "critical",
      title: "Building fire",
      area: "Limbe",
      time: "10 mins ago",
    },
    {
      id: 2,
      lat: -15.795,
      lng: 34.999,
      type: "Accident",
      severity: "medium",
      title: "Road collision",
      area: "Chichiri",
      time: "25 mins ago",
    },
    {
      id: 3,
      lat: -15.778,
      lng: 35.012,
      type: "Medical",
      severity: "critical",
      title: "Medical emergency",
      area: "Blantyre CBD",
      time: "5 mins ago",
    },
    {
      id: 4,
      lat: -15.81,
      lng: 35.02,
      type: "Crime",
      severity: "medium",
      title: "Theft reported",
      area: "Ndirande",
      time: "1 hr ago",
    },
    {
      id: 5,
      lat: -15.76,
      lng: 34.98,
      type: "Infrastructure",
      severity: "low",
      title: "Road damage",
      area: "Chilomoni",
      time: "2 hrs ago",
    },
    {
      id: 6,
      lat: -15.82,
      lng: 35.04,
      type: "Fire",
      severity: "low",
      title: "Grass fire",
      area: "Bangwe",
      time: "3 hrs ago",
    },
    // These are far away — should be filtered out if user is in central Blantyre
    {
      id: 7,
      lat: -15.2,
      lng: 35.0,
      type: "Flood",
      severity: "critical",
      title: "Flash flood",
      area: "Zomba",
      time: "30 mins ago",
    },
    {
      id: 8,
      lat: -14.0,
      lng: 33.79,
      type: "Accident",
      severity: "medium",
      title: "Truck accident",
      area: "Lilongwe",
      time: "1 hr ago",
    },
  ];

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 600));

  // Backend would do this filter via a DB bounding-box query (PostGIS/ST_Within).
  // We replicate it here for the mock so only geographically relevant results return.
  return mockIncidents.filter(
    (inc) =>
      inc.lat >= swLat &&
      inc.lat <= neLat &&
      inc.lng >= swLng &&
      inc.lng <= neLng,
  );
}

// ─── CUSTOM MARKER ICON ───────────────────────────────────────────────────────

function buildMarkerIcon(severity) {
  const colour = SEVERITY_COLORS[severity] ?? "#8899bb";
  // SVG pin encoded as a data URL — no external image requests needed
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z"
            fill="${colour}" opacity="0.95"/>
      <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>
      <circle cx="16" cy="16" r="4" fill="${colour}"/>
    </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: 32, height: 40 },
    anchor: { x: 16, y: 40 },
  };
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

function IncidentMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
  });

  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }
  const [locationError, setLocationError] = useState(null);
  const [radius, setRadius] = useState(RADIUS_KM); // km, user-adjustable
  const [incidents, setIncidents] = useState([]); // raw from API
  const [nearby, setNearby] = useState([]); // filtered by radius
  const [selected, setSelected] = useState(null); // incident in InfoWindow
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(true);

  // ── 1. GET USER'S CURRENT LOCATION ────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      (err) => {
        // Common errors: user denied, timeout, unavailable
        const messages = {
          1: "Location access was denied. Please allow location in your browser settings.",
          2: "Could not determine your location. Try again.",
          3: "Location request timed out.",
        };
        setLocationError(messages[err.code] ?? "Unknown location error.");
        setLocating(false);
      },
      {
        enableHighAccuracy: true, // GPS-level accuracy where available
        timeout: 10000, // 10 second timeout
        maximumAge: 60000, // accept a cached position up to 1 minute old
      },
    );
  }, []);

  // ── 2. FETCH INCIDENTS ONCE WE HAVE LOCATION ──────────────────────────────
  // We only request incidents within the bounding box of the user's radius.
  // This means the backend only returns ~30 Blantyre incidents, not 200 nationwide.

  useEffect(() => {
    if (!userLocation) return;

    const fetchNearby = async () => {
      setLoading(true);

      // Build a bounding box around the user (rough approximation).
      // 1 degree lat ≈ 111km, 1 degree lng ≈ 111km * cos(lat)
      const latDelta = (radius * 1.5) / 111;
      const lngDelta =
        (radius * 1.5) / (111 * Math.cos((userLocation.lat * Math.PI) / 180));

      const swLat = userLocation.lat - latDelta;
      const swLng = userLocation.lng - lngDelta;
      const neLat = userLocation.lat + latDelta;
      const neLng = userLocation.lng + lngDelta;

      try {
        const data = await fetchIncidentsInBounds(swLat, swLng, neLat, neLng);
        setIncidents(data);
      } catch (err) {
        console.error("Failed to fetch incidents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNearby();
  }, [userLocation, radius]); // re-fetch if user changes the radius slider

  // ── 3. FILTER BY EXACT RADIUS (client-side) ───────────────────────────────
  // The bounding box fetch is an approximation (a square, not a circle).
  // This step filters to the actual circular radius using haversine distance.
  // Cheap — runs in JS with no API call.

  useEffect(() => {
    if (!userLocation) return;

    const filtered = incidents.filter((inc) => {
      const dist = getDistanceKm(
        userLocation.lat,
        userLocation.lng,
        inc.lat,
        inc.lng,
      );
      return dist <= radius;
    });

    setNearby(filtered);
  }, [incidents, userLocation, radius]);

  // ── MAP CALLBACKS ──────────────────────────────────────────────────────────

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  // ── RENDER STATES ──────────────────────────────────────────────────────────

  if (loadError) return <ErrorState message="Google Maps failed to load." />;
  if (locating)
    return <StatusState icon="📍" message="Getting your location…" />;
  if (locationError) return <ErrorState message={locationError} />;
  if (!isLoaded) return <StatusState icon="🗺️" message="Loading map…" />;

  // ── MAIN RENDER ────────────────────────────────────────────────────────────

  return (
    <div style={styles.wrapper}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>📍 Incidents Near You</h2>
          <p style={styles.subtitle}>
            {loading
              ? "Fetching incidents…"
              : `${nearby.length} incident${nearby.length !== 1 ? "s" : ""} within ${radius}km`}
          </p>
        </div>

        {/* ── Radius Slider ── */}
        <div style={styles.sliderWrap}>
          <label style={styles.sliderLabel}>Radius: {radius}km</label>
          <input
            type="range"
            min="2"
            max="5"
            step="0.5"
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            style={styles.slider}
          />
          <div style={styles.sliderRange}>
            <span>2km</span>
            <span>5km</span>
          </div>
        </div>
      </div>

      {/* ── Severity Legend ── */}
      <div style={styles.legend}>
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} style={styles.legendItem}>
            <div style={{ ...styles.legendDot, background: color }} />
            <span style={styles.legendText}>
              {sev.charAt(0).toUpperCase() + sev.slice(1)}
            </span>
          </div>
        ))}
        <div style={styles.legendItem}>
          <div
            style={{
              ...styles.legendDot,
              background: "#3b82f6",
              borderRadius: 2,
            }}
          />
          <span style={styles.legendText}>You</span>
        </div>
      </div>

      {/* ── Map ── */}
      <div style={styles.mapContainer}>
        <GoogleMap
          mapContainerStyle={styles.map}
          center={userLocation}
          zoom={14} // zoom 14 ≈ neighbourhood level, perfect for 3km radius
          options={{
            styles: MAP_STYLES,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false, // hide satellite/map toggle — saves space
            streetViewControl: false,
            fullscreenControl: true,
            // Restrict how far the user can zoom out — keeps focus local
            minZoom: 11,
            maxZoom: 18,
          }}
          onLoad={onMapLoad}
        >
          {/* ── Radius circle around user ── */}
          <Circle
            center={userLocation}
            radius={radius * 1000} // metres
            options={{
              fillColor: "#1e4db7",
              fillOpacity: 0.08,
              strokeColor: "#2563eb",
              strokeOpacity: 0.4,
              strokeWeight: 1.5,
            }}
          />

          {/* ── User's location marker ── */}
          <AdvancedMarkerElement
            position={userLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2.5,
            }}
            title="You are here"
            zIndex={999}
          />

          {/* ── Incident markers ── */}
          {nearby.map((inc) => (
            <AdvancedMarkerElement
              key={inc.id}
              position={{ lat: inc.lat, lng: inc.lng }}
              icon={buildMarkerIcon(inc.severity)}
              onClick={() => setSelected(inc)}
            />
          ))}

          {/* ── Info window on marker click ── */}
          {selected && (
            <InfoWindow
              position={{ lat: selected.lat, lng: selected.lng }}
              onCloseClick={() => setSelected(null)}
            >
              <div style={styles.infoWindow}>
                <div
                  style={{
                    ...styles.infoSeverity,
                    background: SEVERITY_COLORS[selected.severity] + "22",
                    color: SEVERITY_COLORS[selected.severity],
                    border: `1px solid ${SEVERITY_COLORS[selected.severity]}55`,
                  }}
                >
                  {selected.severity.toUpperCase()}
                </div>
                <h3 style={styles.infoTitle}>{selected.title}</h3>
                <p style={styles.infoMeta}>📌 {selected.area}</p>
                <p style={styles.infoMeta}>🏷️ {selected.type}</p>
                <p style={styles.infoMeta}>🕐 {selected.time}</p>
                <p style={styles.infoDist}>
                  📍{" "}
                  {getDistanceKm(
                    userLocation.lat,
                    userLocation.lng,
                    selected.lat,
                    selected.lng,
                  ).toFixed(2)}
                  km from you
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Loading overlay */}
        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner} />
            <p style={{ color: "#8899bb", marginTop: 12, fontSize: 14 }}>
              Fetching incidents…
            </p>
          </div>
        )}
      </div>

      {/* ── Incident list below map ── */}
      {nearby.length > 0 && (
        <div style={styles.listSection}>
          <h3 style={styles.listTitle}>Nearby Incidents</h3>
          <div style={styles.list}>
            {nearby
              .sort((a, b) => {
                // Sort by distance — closest first
                const dA = getDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  a.lat,
                  a.lng,
                );
                const dB = getDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  b.lat,
                  b.lng,
                );
                return dA - dB;
              })
              .map((inc) => {
                const dist = getDistanceKm(
                  userLocation.lat,
                  userLocation.lng,
                  inc.lat,
                  inc.lng,
                );
                return (
                  <div
                    key={inc.id}
                    style={{
                      ...styles.listItem,
                      borderLeft: `3px solid ${SEVERITY_COLORS[inc.severity]}`,
                    }}
                    onClick={() => {
                      setSelected(inc);
                      mapRef.current?.panTo({ lat: inc.lat, lng: inc.lng });
                    }}
                  >
                    <div style={styles.listItemLeft}>
                      <span style={styles.listType}>{inc.type}</span>
                      <span style={styles.listTitle2}>{inc.title}</span>
                      <span style={styles.listArea}>📌 {inc.area}</span>
                    </div>
                    <div style={styles.listItemRight}>
                      <span
                        style={{
                          ...styles.listSev,
                          color: SEVERITY_COLORS[inc.severity],
                        }}
                      >
                        {inc.severity}
                      </span>
                      <span style={styles.listDist}>{dist.toFixed(1)}km</span>
                      <span style={styles.listTime}>{inc.time}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {!loading && nearby.length === 0 && (
        <div style={styles.emptyState}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>✅</p>
          <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            No incidents within {radius}km
          </p>
          <p style={{ color: "#8899bb", fontSize: 14 }}>
            Your area looks clear. Try increasing the radius to see more.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── HELPER COMPONENTS ────────────────────────────────────────────────────────

function StatusState({ icon, message }) {
  return (
    <div style={{ ...styles.wrapper, ...styles.centered }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>{icon}</p>
      <p style={{ color: "#8899bb", fontSize: 15 }}>{message}</p>
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div style={{ ...styles.wrapper, ...styles.centered }}>
      <p style={{ fontSize: 40, marginBottom: 16 }}>⚠️</p>
      <p
        style={{
          color: "#e63946",
          fontSize: 15,
          maxWidth: 360,
          textAlign: "center",
        }}
      >
        {message}
      </p>
    </div>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const styles = {
  wrapper: {
    background: "#0b1120",
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,0.07)",
    fontFamily: "'DM Sans', sans-serif",
    color: "#f0f4ff",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    padding: 48,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    padding: "24px 28px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    margin: 0,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#8899bb",
    margin: 0,
  },
  sliderWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
    minWidth: 180,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#8899bb",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  slider: {
    width: "100%",
    accentColor: "#2563eb",
    cursor: "pointer",
  },
  sliderRange: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    fontSize: 11,
    color: "#8899bb",
  },
  legend: {
    display: "flex",
    gap: 20,
    padding: "12px 28px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexWrap: "wrap",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
  },
  legendText: {
    fontSize: 12,
    color: "#8899bb",
  },
  mapContainer: {
    position: "relative",
    height: 480,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(11,17,32,0.7)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(4px)",
  },
  loadingSpinner: {
    width: 36,
    height: 36,
    border: "3px solid rgba(30,77,183,0.2)",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  infoWindow: {
    background: "#121d33",
    borderRadius: 10,
    padding: "14px 16px",
    minWidth: 180,
    color: "#f0f4ff",
  },
  infoSeverity: {
    display: "inline-block",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "1.5px",
    padding: "3px 8px",
    borderRadius: 100,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 700,
    margin: "0 0 8px",
    color: "#f0f4ff",
  },
  infoMeta: {
    fontSize: 12,
    color: "#8899bb",
    margin: "3px 0",
  },
  infoDist: {
    fontSize: 12,
    color: "#2563eb",
    fontWeight: 600,
    marginTop: 8,
  },
  listSection: {
    padding: "24px 28px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#8899bb",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 16,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#141e35",
    borderRadius: 10,
    padding: "14px 18px 14px 16px",
    cursor: "pointer",
    transition: "background 0.2s",
    gap: 12,
  },
  listItemLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 3,
  },
  listItemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 3,
    flexShrink: 0,
  },
  listType: {
    fontSize: 10,
    color: "#8899bb",
    fontWeight: 600,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },
  listTitle2: {
    fontSize: 14,
    fontWeight: 600,
  },
  listArea: {
    fontSize: 12,
    color: "#8899bb",
  },
  listSev: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "capitalize",
  },
  listDist: {
    fontSize: 13,
    fontWeight: 700,
    color: "#2563eb",
  },
  listTime: {
    fontSize: 11,
    color: "#8899bb",
  },
  emptyState: {
    padding: "48px 28px",
    textAlign: "center",
    borderTop: "1px solid rgba(255,255,255,0.07)",
  },
};

export default IncidentMap;
