export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
  streets: "mapbox://styles/mapbox/streets-v12",
  outdoors: "mapbox://styles/mapbox/outdoors-v12",
};

export const DEFAULT_CENTER: [number, number] = [-98.5795, 39.8283]; // Center of US
export const DEFAULT_ZOOM = 4;
export const DETAIL_ZOOM = 14;

export interface MapLocation {
  latitude: number;
  longitude: number;
}

export async function geocodeAddress(address: string): Promise<MapLocation | null> {
  if (!MAPBOX_ACCESS_TOKEN) return null;

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].center;
      return { latitude, longitude };
    }

    return null;
  } catch {
    return null;
  }
}

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  if (!MAPBOX_ACCESS_TOKEN) return null;

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=place,locality`
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }

    return null;
  } catch {
    return null;
  }
}

export function getBoundsFromPlaces(
  places: Array<{ latitude: number; longitude: number }>
): [[number, number], [number, number]] | null {
  if (places.length === 0) return null;

  let minLat = places[0].latitude;
  let maxLat = places[0].latitude;
  let minLng = places[0].longitude;
  let maxLng = places[0].longitude;

  places.forEach((place) => {
    minLat = Math.min(minLat, place.latitude);
    maxLat = Math.max(maxLat, place.latitude);
    minLng = Math.min(minLng, place.longitude);
    maxLng = Math.max(maxLng, place.longitude);
  });

  // Add some padding
  const latPadding = (maxLat - minLat) * 0.1 || 0.01;
  const lngPadding = (maxLng - minLng) * 0.1 || 0.01;

  return [
    [minLng - lngPadding, minLat - latPadding],
    [maxLng + lngPadding, maxLat + latPadding],
  ];
}
