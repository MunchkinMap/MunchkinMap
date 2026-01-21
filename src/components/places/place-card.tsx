"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { Place } from "@/types";
import {
  MapPin,
  Star,
  Baby,
  Utensils,
  Volume2,
  CheckCircle2,
  Users,
} from "lucide-react";

interface PlaceCardProps {
  place: Place;
  variant?: "default" | "compact" | "horizontal";
  showDistance?: boolean;
  distance?: number;
}

const categoryIcons: Record<string, typeof Utensils> = {
  restaurant: Utensils,
  cafe: Utensils,
  park: MapPin,
  playground: Baby,
};

const noiseLabels: Record<string, string> = {
  quiet: "Quiet",
  moderate: "Moderate",
  loud: "Lively",
  unknown: "Unknown",
};

// Helper to format changing station locations
function getChangingStationBadges(locations: string[] | undefined) {
  if (!locations || locations.length === 0) return [];

  const badges: { label: string; variant: "changing" | "quiet" | "family" }[] = [];

  if (locations.includes("mens")) {
    badges.push({ label: "Men's Room", variant: "quiet" });
  }
  if (locations.includes("womens")) {
    badges.push({ label: "Women's Room", variant: "changing" });
  }
  if (locations.includes("family") || locations.includes("unisex")) {
    badges.push({ label: "Family Room", variant: "family" });
  }

  return badges;
}

export function PlaceCard({
  place,
  variant = "default",
  showDistance,
  distance,
}: PlaceCardProps) {
  const CategoryIcon = categoryIcons[place.category] || MapPin;
  const primaryImage = place.images?.find((img) => img.is_primary) || place.images?.[0];

  // Get changing station location badges
  const changingStationBadges = place.amenities?.changing_station?.available
    ? getChangingStationBadges(place.amenities.changing_station.locations)
    : [];

  const amenityBadges = [];
  if (place.amenities?.high_chairs) {
    amenityBadges.push({ label: "High Chairs", variant: "highchair" as const });
  }
  if (place.amenities?.stroller_friendly) {
    amenityBadges.push({ label: "Stroller Friendly", variant: "stroller" as const });
  }
  if (place.amenities?.play_area) {
    amenityBadges.push({ label: "Play Area", variant: "family" as const });
  }

  if (variant === "compact") {
    return (
      <Link href={`/places/${place.slug}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {primaryImage ? (
                  <Image
                    src={primaryImage.url}
                    alt={place.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{place.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {place.address}, {place.city}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {place.average_rating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {place.average_rating.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {showDistance && distance !== undefined && (
                    <span className="text-sm text-muted-foreground">
                      {distance < 1
                        ? `${(distance * 5280).toFixed(0)} ft`
                        : `${distance.toFixed(1)} mi`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link href={`/places/${place.slug}`}>
        <Card className="card-storybook hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
          <div className="flex">
            <div className="relative w-48 h-36 flex-shrink-0 bg-gradient-hero">
              {primaryImage ? (
                <Image
                  src={primaryImage.url}
                  alt={place.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CategoryIcon className="h-10 w-10 text-terracotta/30" />
                </div>
              )}
            </div>
            <CardContent className="flex-1 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold">{place.name}</h3>
                    {place.is_verified && (
                      <CheckCircle2 className="h-4 w-4 text-sage" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {place.address}, {place.city}
                  </p>
                </div>
                {place.average_rating > 0 && (
                  <div className="flex items-center gap-1 bg-honey/10 px-2 py-1 rounded-lg">
                    <Star className="h-4 w-4 fill-honey text-honey" />
                    <span className="font-semibold text-sm">{place.average_rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Changing Station Locations - Prominent Display */}
              {changingStationBadges.length > 0 && (
                <div className="mt-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Baby className="h-3.5 w-3.5" />
                    <span className="font-medium">Changing Tables:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {changingStationBadges.map((badge) => (
                      <Badge key={badge.label} variant={badge.variant} size="sm">
                        {badge.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 mt-2">
                {amenityBadges.slice(0, 3).map((badge) => (
                  <Badge key={badge.label} variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Default variant
  return (
    <Link href={`/places/${place.slug}`}>
      <Card className="card-storybook hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
        <div className="relative aspect-[4/3] bg-gradient-hero">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={place.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <CategoryIcon className="h-12 w-12 text-terracotta/30" />
            </div>
          )}
          {place.is_verified && (
            <div className="absolute top-3 right-3 bg-sage text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </div>
          )}
          {place.price_range && (
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur px-2 py-1 rounded-lg text-sm font-medium">
              {place.price_range}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-lg line-clamp-1">{place.name}</h3>
            {place.average_rating > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <Star className="h-4 w-4 fill-honey text-honey" />
                <span className="font-semibold">{place.average_rating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">
                  ({place.review_count})
                </span>
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-terracotta" />
            <span className="line-clamp-1">
              {place.city}, {place.state}
            </span>
            {showDistance && distance !== undefined && (
              <span className="text-muted-foreground ml-1">
                • {distance < 1 ? `${(distance * 5280).toFixed(0)} ft` : `${distance.toFixed(1)} mi`}
              </span>
            )}
          </p>

          {/* Changing Station Locations - Prominent Display */}
          {changingStationBadges.length > 0 && (
            <div className="mb-3 p-2 bg-parchment rounded-lg">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
                <Baby className="h-3.5 w-3.5 text-terracotta" />
                <span className="font-medium">Changing Tables In:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {changingStationBadges.map((badge) => (
                  <Badge key={badge.label} variant={badge.variant} size="sm">
                    {badge.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {amenityBadges.slice(0, 4).map((badge) => (
              <Badge key={badge.label} variant={badge.variant} size="sm">
                {badge.label}
              </Badge>
            ))}
          </div>
          {place.amenities?.noise_level && place.amenities.noise_level !== "unknown" && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Volume2 className="h-3.5 w-3.5" />
              <span>{noiseLabels[place.amenities.noise_level]}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
