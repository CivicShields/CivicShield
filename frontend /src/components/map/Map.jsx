import React, { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Shield, Search, Navigation } from "lucide-react";
import L from "leaflet";
import styles from "./Map.module.css";

// --- Math: Haversine Formula for Distance ---
// Calculates distance between two points in kilometers
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

// --- Helper Component: Auto-Center on User ---
const MapController = ({ userLocation, setUserLocation }) => {
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", (e) => {
      setUserLocation(e.latlng);
      map.flyTo(e.latlng, 14, { animate: true });
    });
  }, [map, setUserLocation]);

  return null;
};

function ViewMapPage({ allIncidentsFromAPI }) {
  const [userLocation, setUserLocation] = useState(null); // Default: null
  const [radius, setRadius] = useState(5); // Default 5km radius
  const [zoomLevel, setZoomLevel] = useState(13);

  // --- Optimization: Memoized Filtered List ---
  const filteredIncidents = useMemo(() => {
    if (!userLocation) return []; // Don't render until we know where the user is

    return allIncidentsFromAPI.filter((incident) => {
      const distance = getDistance(
        userLocation.lat,
        userLocation.lng,
        incident.lat,
        incident.lng,
      );
      return distance <= radius;
    });
  }, [userLocation, radius, allIncidentsFromAPI]);

  return (
    <div className={styles.pageWrapper}>
      <aside className={styles.sidebar}>
        <div className={styles.logoArea}>
          <Shield size={24} />
          <span>SafetyTrack</span>
        </div>

        <div className={styles.filterGroup}>
          <h3 className={styles.filterHeader}>Proximity Filter</h3>
          <p className="text-xs text-slate-500 mb-2">
            Showing incidents within {radius}km
          </p>
          <input
            type="range"
            min="1"
            max="20"
            value={radius}
            onChange={(e) => setRadius(parseInt(e.target.value))}
            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] mt-1 font-bold">
            <span>1KM</span>
            <span>20KM</span>
          </div>
        </div>

        <div className={styles.statsCard}>
          <p className="text-sm font-medium">
            Local Incidents:{" "}
            <span className="text-blue-600 font-bold">
              {filteredIncidents.length}
            </span>
          </p>
          <p className="text-[10px] text-slate-400">
            Total in Malawi: {allIncidentsFromAPI.length}
          </p>
        </div>
      </aside>

      <main className={styles.mainArea}>
        <MapContainer
          center={[-15.78, 35.0]} // Blantyre Coords
          zoom={12}
          preferCanvas={true} // Performance boost!
          className={styles.mapContainer}
          zoomControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

          {/* Custom logic to find and fly to user */}
          <MapController
            userLocation={userLocation}
            setUserLocation={setUserLocation}
          />

          <ZoomControl position="bottomright" />

          <MarkerClusterGroup chunkedLoading>
            {filteredIncidents.map((incident) => (
              <Marker
                key={incident.id}
                position={[incident.lat, incident.lng]}
                // Pass zoomLevel to icon if you want to stop pulse at low zoom
                icon={createCustomIcon(incident.severity, zoomLevel > 13)}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{incident.type}</strong>
                    <br />
                    {getDistance(
                      userLocation.lat,
                      userLocation.lng,
                      incident.lat,
                      incident.lng,
                    ).toFixed(2)}
                    km away
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </main>
    </div>
  );
}

export default ViewMapPage;
