"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAPBOX_ACCESS_TOKEN, MAP_STYLES, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/mapbox";
import type { Place } from "@/types";

interface MapViewProps {
  places?: Place[];
  center?: [number, number];
  zoom?: number;
  onPlaceSelect?: (place: Place) => void;
  selectedPlaceId?: string;
  className?: string;
}

export function MapView({
  places = [],
  center = DEFAULT_CENTER,
  zoom = DEFAULT_ZOOM,
  onPlaceSelect,
  selectedPlaceId,
  className = "",
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLES.light,
      center,
      zoom,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [center, zoom]);

  // Update markers when places change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add new markers
    places.forEach((place) => {
      const el = document.createElement("div");
      el.className = "map-marker";
      el.innerHTML = `
        <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-transform hover:scale-110 ${
          selectedPlaceId === place.id
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-white text-primary border-2 border-primary"
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;

      el.addEventListener("click", () => {
        onPlaceSelect?.(place);
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.longitude, place.latitude])
        .addTo(map.current!);

      markers.current.push(marker);
    });
  }, [places, mapLoaded, onPlaceSelect, selectedPlaceId]);

  // Update center when it changes
  useEffect(() => {
    if (map.current && mapLoaded) {
      map.current.flyTo({ center, zoom: zoom || map.current.getZoom() });
    }
  }, [center, zoom, mapLoaded]);

  // Fly to selected place
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedPlaceId) return;

    const selectedPlace = places.find((p) => p.id === selectedPlaceId);
    if (selectedPlace) {
      map.current.flyTo({
        center: [selectedPlace.longitude, selectedPlace.latitude],
        zoom: 15,
      });
    }
  }, [selectedPlaceId, places, mapLoaded]);

  return (
    <div ref={mapContainer} className={`w-full h-full min-h-[400px] ${className}`} />
  );
}
