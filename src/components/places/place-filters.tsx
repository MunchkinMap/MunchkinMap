"use client";

import { useState } from "react";
import {
  Button,
  Badge,
  Checkbox,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import type { SearchFilters, PlaceCategory, AmenityType, NoiseLevel, PriceRange } from "@/types";
import {
  Filter,
  X,
  Baby,
  Utensils,
  Coffee,
  TreePine,
  Building,
  Sparkles,
  Music,
  Library,
  ShoppingBag,
  HeartPulse,
} from "lucide-react";

interface PlaceFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const categories: { value: PlaceCategory; label: string; icon: typeof Utensils }[] = [
  { value: "restaurant", label: "Restaurants", icon: Utensils },
  { value: "cafe", label: "Cafes", icon: Coffee },
  { value: "park", label: "Parks", icon: TreePine },
  { value: "playground", label: "Playgrounds", icon: Baby },
  { value: "museum", label: "Museums", icon: Building },
  { value: "library", label: "Libraries", icon: Library },
  { value: "shopping", label: "Shopping", icon: ShoppingBag },
  { value: "entertainment", label: "Entertainment", icon: Music },
  { value: "healthcare", label: "Healthcare", icon: HeartPulse },
  { value: "other", label: "Other", icon: Sparkles },
];

const amenities: { value: AmenityType; label: string; icon: string }[] = [
  { value: "changing_station", label: "Changing Station", icon: "🚻" },
  { value: "high_chairs", label: "High Chairs", icon: "🪑" },
  { value: "kids_menu", label: "Kids Menu", icon: "🍽️" },
  { value: "stroller_friendly", label: "Stroller Friendly", icon: "👶" },
  { value: "play_area", label: "Play Area", icon: "🎠" },
  { value: "nursing_room", label: "Nursing Room", icon: "🤱" },
  { value: "family_restroom", label: "Family Restroom", icon: "👨‍👩‍👧" },
  { value: "outdoor_seating", label: "Outdoor Seating", icon: "☀️" },
  { value: "wheelchair_accessible", label: "Wheelchair Accessible", icon: "♿" },
  { value: "parking", label: "Parking", icon: "🅿️" },
];

const changingLocations = [
  { value: "mens", label: "Men's Room", emoji: "👨", description: "Dad-friendly!" },
  { value: "womens", label: "Women's Room", emoji: "👩", description: "" },
  { value: "family", label: "Family Room", emoji: "👨‍👩‍👧", description: "All welcome" },
  { value: "unisex", label: "Unisex", emoji: "🚻", description: "" },
];

const noiseLevels: { value: NoiseLevel; label: string }[] = [
  { value: "quiet", label: "Quiet" },
  { value: "moderate", label: "Moderate" },
  { value: "loud", label: "Lively" },
];

const priceRanges: PriceRange[] = ["$", "$$", "$$$", "$$$$"];

export function PlaceFilters({
  filters,
  onFiltersChange,
  className,
}: PlaceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleCategory = (category: PlaceCategory) => {
    const current = filters.category || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFiltersChange({ ...filters, category: updated.length > 0 ? updated : undefined });
  };

  const toggleAmenity = (amenity: AmenityType) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter((a) => a !== amenity)
      : [...current, amenity];
    onFiltersChange({ ...filters, amenities: updated.length > 0 ? updated : undefined });
  };

  const toggleNoiseLevel = (level: NoiseLevel) => {
    const current = filters.noise_level || [];
    const updated = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];
    onFiltersChange({ ...filters, noise_level: updated.length > 0 ? updated : undefined });
  };

  const togglePriceRange = (price: PriceRange) => {
    const current = filters.price_range || [];
    const updated = current.includes(price)
      ? current.filter((p) => p !== price)
      : [...current, price];
    onFiltersChange({ ...filters, price_range: updated.length > 0 ? updated : undefined });
  };

  const activeFilterCount =
    (filters.category?.length || 0) +
    (filters.amenities?.length || 0) +
    (filters.noise_level?.length || 0) +
    (filters.price_range?.length || 0) +
    (filters.min_rating ? 1 : 0) +
    (filters.is_verified ? 1 : 0);

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile filter toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFilterCount}
              </Badge>
            )}
          </span>
          {isExpanded ? <X className="h-4 w-4" /> : null}
        </Button>
      </div>

      <div className={cn("space-y-6", !isExpanded && "hidden lg:block")}>
        {/* Active filters */}
        {activeFilterCount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""} active
            </span>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
        )}

        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = filters.category?.includes(category.value);
              return (
                <button
                  key={category.value}
                  onClick={() => toggleCategory(category.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Amenities */}
        <div>
          <h3 className="font-semibold mb-3">Amenities</h3>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => {
              const isActive = filters.amenities?.includes(amenity.value);
              return (
                <label
                  key={amenity.value}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors",
                    isActive ? "bg-primary/10" : "hover:bg-muted"
                  )}
                >
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={() => toggleAmenity(amenity.value)}
                  />
                  <span className="mr-1">{amenity.icon}</span>
                  <span className="text-sm">{amenity.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Changing Station Location - Key Feature! */}
        <div className="bg-blue-50 dark:bg-blue-950/30 -mx-4 px-4 py-4 rounded-lg">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Baby className="h-4 w-4 text-blue-600" />
            Changing Table Location
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Find places where dads can change diapers too!
          </p>
          <div className="grid grid-cols-2 gap-2">
            {changingLocations.map((location) => {
              const isActive = filters.changing_station_location?.includes(
                location.value as "mens" | "womens" | "family" | "unisex"
              );
              const isMens = location.value === "mens";
              return (
                <button
                  key={location.value}
                  onClick={() => {
                    const current = filters.changing_station_location || [];
                    const updated = current.includes(location.value as "mens" | "womens" | "family" | "unisex")
                      ? current.filter((l) => l !== location.value)
                      : [...current, location.value as "mens" | "womens" | "family" | "unisex"];
                    onFiltersChange({
                      ...filters,
                      changing_station_location: updated.length > 0 ? updated : undefined,
                    });
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? isMens
                        ? "bg-blue-600 text-white ring-2 ring-blue-300"
                        : "bg-primary text-primary-foreground"
                      : isMens
                        ? "bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 border-2 border-blue-300"
                        : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <span className="text-lg">{location.emoji}</span>
                  <span className="text-xs">{location.label}</span>
                  {location.description && (
                    <span className={cn(
                      "text-[10px]",
                      isActive ? "text-white/80" : "text-muted-foreground"
                    )}>
                      {location.description}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Noise Level */}
        <div>
          <h3 className="font-semibold mb-3">Noise Level</h3>
          <div className="flex flex-wrap gap-2">
            {noiseLevels.map((level) => {
              const isActive = filters.noise_level?.includes(level.value);
              return (
                <button
                  key={level.value}
                  onClick={() => toggleNoiseLevel(level.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {level.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Price Range */}
        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <div className="flex gap-2">
            {priceRanges.map((price) => {
              const isActive = filters.price_range?.includes(price);
              return (
                <button
                  key={price}
                  onClick={() => togglePriceRange(price)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {price}
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <h3 className="font-semibold mb-3">Minimum Rating</h3>
          <Select
            value={filters.min_rating?.toString() || "any"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                min_rating: value && value !== "any" ? parseFloat(value) : undefined,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any rating</SelectItem>
              <SelectItem value="3">3+ stars</SelectItem>
              <SelectItem value="3.5">3.5+ stars</SelectItem>
              <SelectItem value="4">4+ stars</SelectItem>
              <SelectItem value="4.5">4.5+ stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.is_verified || false}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, is_verified: checked ? true : undefined })
              }
            />
            <span className="text-sm">Verified places only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={filters.has_photos || false}
              onCheckedChange={(checked) =>
                onFiltersChange({ ...filters, has_photos: checked ? true : undefined })
              }
            />
            <span className="text-sm">Has photos</span>
          </label>
        </div>
      </div>
    </div>
  );
}
