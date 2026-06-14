// utilities/location_utilities.js

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';

const geocodeCache = new Map(); // simple cache to avoid duplicate calls

/**
 * Convert lat/lon to a human‑readable address
 * @param {number} lat 
 * @param {number} lon 
 * @returns {Promise<string>} e.g. "M1, Area 2, Lilongwe, Central Region, Malawi"
 */
export async function reverseGeocode(lat, lon) {
    // round to 5 decimal places (~1m precision) for caching
    const cacheKey = `${lat.toFixed(5)},${lon.toFixed(5)}`;
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

    const url = `${NOMINATIM_URL}?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Nominatim request failed');
    const data = await response.json();
    const address = data.display_name || 'Unknown location';
    geocodeCache.set(cacheKey, address);
    return address;
}