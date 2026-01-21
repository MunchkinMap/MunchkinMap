"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button, Input, Card, CardContent } from "@/components/ui";
import { PlaceCard, PlaceFilters } from "@/components/places";
import type { Place, SearchFilters, SortOption } from "@/types";
import {
  Search,
  MapPin,
  List,
  Map as MapIcon,
  SlidersHorizontal,
  Loader2,
} from "lucide-react";

// Dynamically import the map to avoid SSR issues
const MapView = dynamic(
  () => import("@/components/maps/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[400px] bg-muted flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

// Mock data for demo - in real app, this comes from Supabase
const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Family Kitchen Restaurant",
    slug: "family-kitchen-restaurant",
    description: "A warm, welcoming restaurant perfect for families with young children.",
    category: "restaurant",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zip_code: "78701",
    country: "USA",
    latitude: 30.2672,
    longitude: -97.7431,
    phone: "(512) 555-0123",
    website: "https://familykitchen.example.com",
    hours: null,
    price_range: "$$",
    amenities: {
      changing_station: {
        available: true,
        locations: ["mens", "womens", "family"],
        condition: "excellent",
        last_verified: "2024-01-15",
      },
      high_chairs: true,
      kids_menu: true,
      stroller_friendly: true,
      outdoor_seating: true,
      play_area: true,
      nursing_room: false,
      family_restroom: true,
      noise_level: "moderate",
      wheelchair_accessible: true,
      parking: { available: true, type: ["lot"], stroller_accessible: true },
      additional: [],
    },
    images: [],
    is_verified: true,
    is_claimed: false,
    claimed_by: null,
    average_rating: 4.5,
    review_count: 128,
    contribution_count: 15,
    created_at: "2024-01-01",
    updated_at: "2024-01-15",
  },
  {
    id: "2",
    name: "Little Sprouts Cafe",
    slug: "little-sprouts-cafe",
    description: "Cozy cafe with an amazing play area for toddlers.",
    category: "cafe",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    zip_code: "78702",
    country: "USA",
    latitude: 30.2649,
    longitude: -97.7326,
    phone: "(512) 555-0456",
    website: "https://littlesprouts.example.com",
    hours: null,
    price_range: "$",
    amenities: {
      changing_station: {
        available: true,
        locations: ["family"],
        condition: "good",
        last_verified: "2024-01-10",
      },
      high_chairs: true,
      kids_menu: true,
      stroller_friendly: true,
      outdoor_seating: false,
      play_area: true,
      nursing_room: true,
      family_restroom: true,
      noise_level: "moderate",
      wheelchair_accessible: true,
      parking: { available: true, type: ["street"], stroller_accessible: true },
      additional: [],
    },
    images: [],
    is_verified: true,
    is_claimed: true,
    claimed_by: null,
    average_rating: 4.8,
    review_count: 89,
    contribution_count: 8,
    created_at: "2024-01-01",
    updated_at: "2024-01-10",
  },
  {
    id: "3",
    name: "Sunshine Park",
    slug: "sunshine-park",
    description: "Beautiful park with shaded playground and picnic areas.",
    category: "park",
    address: "789 Park Road",
    city: "Austin",
    state: "TX",
    zip_code: "78703",
    country: "USA",
    latitude: 30.2755,
    longitude: -97.7528,
    phone: null,
    website: null,
    hours: null,
    price_range: "$",
    amenities: {
      changing_station: {
        available: true,
        locations: ["family"],
        condition: "good",
        last_verified: "2024-01-08",
      },
      high_chairs: false,
      kids_menu: false,
      stroller_friendly: true,
      outdoor_seating: true,
      play_area: true,
      nursing_room: false,
      family_restroom: true,
      noise_level: "moderate",
      wheelchair_accessible: true,
      parking: { available: true, type: ["lot"], stroller_accessible: true },
      additional: ["Shaded areas", "Water fountain", "Restrooms"],
    },
    images: [],
    is_verified: false,
    is_claimed: false,
    claimed_by: null,
    average_rating: 4.2,
    review_count: 56,
    contribution_count: 12,
    created_at: "2024-01-01",
    updated_at: "2024-01-08",
  },
];

function PlacesContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"list" | "map" | "split">("split");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // In real app, fetch places based on filters and location
  const places = mockPlaces;

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaceId(place.id);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search places, restaurants, cafes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 md:max-w-xs relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="City or zip code"
                className="pl-10 h-11"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
                <Button
                  variant={viewMode === "split" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("split")}
                  className="rounded-none border-x"
                >
                  <span className="flex items-center gap-1">
                    <List className="h-4 w-4" />
                    <MapIcon className="h-4 w-4" />
                  </span>
                </Button>
                <Button
                  variant={viewMode === "map" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("map")}
                  className="rounded-none"
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside
            className={`w-72 flex-shrink-0 ${
              showFilters ? "block" : "hidden"
            } lg:block`}
          >
            <Card className="sticky top-36">
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </h2>
                <PlaceFilters filters={filters} onFiltersChange={setFilters} />
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{places.length}</span>{" "}
                places found
              </p>
              <select className="text-sm border rounded-lg px-3 py-2 bg-background">
                <option value="relevance">Sort by Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="distance">Nearest</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Content based on view mode */}
            {viewMode === "list" && (
              <div className="grid gap-4">
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} variant="horizontal" />
                ))}
              </div>
            )}

            {viewMode === "map" && (
              <div className="h-[calc(100vh-220px)] rounded-xl overflow-hidden border">
                <MapView
                  places={places}
                  center={[-97.7431, 30.2672]}
                  zoom={12}
                  onPlaceSelect={handlePlaceSelect}
                  selectedPlaceId={selectedPlaceId || undefined}
                />
              </div>
            )}

            {viewMode === "split" && (
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-4 max-h-[calc(100vh-220px)] overflow-y-auto pr-2">
                  {places.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => setSelectedPlaceId(place.id)}
                      className={`cursor-pointer transition-all ${
                        selectedPlaceId === place.id
                          ? "ring-2 ring-primary rounded-xl"
                          : ""
                      }`}
                    >
                      <PlaceCard place={place} variant="horizontal" />
                    </div>
                  ))}
                </div>
                <div className="h-[calc(100vh-220px)] rounded-xl overflow-hidden border sticky top-36 hidden lg:block">
                  <MapView
                    places={places}
                    center={[-97.7431, 30.2672]}
                    zoom={12}
                    onPlaceSelect={handlePlaceSelect}
                    selectedPlaceId={selectedPlaceId || undefined}
                  />
                </div>
              </div>
            )}

            {places.length === 0 && (
              <Card className="p-12 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No places found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or searching in a different area.
                </p>
                <Button onClick={() => setFilters({})}>Clear filters</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlacesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <PlacesContent />
    </Suspense>
  );
}
