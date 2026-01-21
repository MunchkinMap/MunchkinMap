"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button, Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import type { Place, Review } from "@/types";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  Clock,
  Heart,
  Share2,
  CheckCircle2,
  Baby,
  Utensils,
  Navigation,
  ChevronLeft,
  Volume2,
  Loader2,
  Car,
  Armchair,
  TreePine,
  ShieldCheck,
  Users,
  ThumbsUp,
} from "lucide-react";

// Dynamically import map
const MapView = dynamic(
  () => import("@/components/maps/map-view").then((mod) => mod.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[200px] bg-muted flex items-center justify-center rounded-xl">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

const amenityDetails = {
  changing_station: { icon: Baby, label: "Changing Station", color: "changing" },
  high_chairs: { icon: Armchair, label: "High Chairs", color: "highchair" },
  kids_menu: { icon: Utensils, label: "Kids Menu", color: "secondary" },
  stroller_friendly: { icon: Baby, label: "Stroller Friendly", color: "stroller" },
  outdoor_seating: { icon: TreePine, label: "Outdoor Seating", color: "family" },
  play_area: { icon: Baby, label: "Play Area", color: "family" },
  nursing_room: { icon: Heart, label: "Nursing Room", color: "changing" },
  family_restroom: { icon: Users, label: "Family Restroom", color: "family" },
  wheelchair_accessible: { icon: ShieldCheck, label: "Wheelchair Accessible", color: "quiet" },
};

const noiseLabels: Record<string, { label: string; description: string }> = {
  quiet: { label: "Quiet", description: "Great for napping babies" },
  moderate: { label: "Moderate", description: "Normal conversation level" },
  loud: { label: "Lively", description: "Active, energetic environment" },
  unknown: { label: "Unknown", description: "Noise level not reported" },
};

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            {review.user?.avatar_url ? (
              <Image
                src={review.user.avatar_url}
                alt={review.user.full_name || "User"}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-muted-foreground">
                {review.user?.full_name?.charAt(0) || "?"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div>
                <p className="font-semibold">{review.user?.full_name || "Anonymous"}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{review.rating}</span>
              </div>
            </div>
            {review.title && (
              <h4 className="font-semibold mt-2 mb-1">{review.title}</h4>
            )}
            <p className="text-muted-foreground">{review.content}</p>
            {review.with_children_ages && review.with_children_ages.length > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                Visited with children ages: {review.with_children_ages.join(", ")}
              </p>
            )}
            {review.is_verified_visit && (
              <Badge variant="outline" className="mt-2">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Verified Visit
              </Badge>
            )}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => setHelpful(!helpful)}
                className={`flex items-center gap-1.5 text-sm ${
                  helpful ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ThumbsUp className={`h-4 w-4 ${helpful ? "fill-current" : ""}`} />
                Helpful ({review.helpful_count + (helpful ? 1 : 0)})
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PlaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [place, setPlace] = useState<Place | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    async function fetchPlace() {
      try {
        const response = await fetch(`/api/places/${slug}`);
        const data = await response.json();

        if (data.error) {
          console.error("Error fetching place:", data.error);
          return;
        }

        setPlace(data.data);
        setReviews(data.data.reviews || []);
      } catch (error) {
        console.error("Error fetching place:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlace();
  }, [slug]);

  useEffect(() => {
    async function checkFavorite() {
      if (!user || !place || !supabase) return;

      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("place_id", place.id)
        .single();

      setIsFavorite(!!data);
    }

    checkFavorite();
  }, [user, place, supabase]);

  const toggleFavorite = async () => {
    if (!user || !place || !supabase) {
      router.push(`/auth/login?redirect=/places/${slug}`);
      return;
    }

    setFavoriteLoading(true);

    try {
      if (isFavorite) {
        await fetch(`/api/favorites?place_id=${place.id}`, { method: "DELETE" });
        setIsFavorite(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ place_id: place.id }),
        });
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: place?.name,
          text: `Check out ${place?.name} on MunchkinMap!`,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <MapPin className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Place not found</h1>
        <p className="text-muted-foreground">The place you&apos;re looking for doesn&apos;t exist.</p>
        <Button onClick={() => router.push("/places")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Places
        </Button>
      </div>
    );
  }

  const amenityBadges = Object.entries(amenityDetails)
    .filter(([key]) => {
      if (key === "changing_station") {
        return place.amenities?.changing_station?.available;
      }
      return place.amenities?.[key as keyof typeof place.amenities];
    })
    .map(([key, value]) => ({
      key,
      ...value,
    }));

  const primaryImage = place.images?.find((img) => img.is_primary) || place.images?.[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-96 bg-muted">
        {place.images && place.images.length > 0 ? (
          <>
            <Image
              src={place.images[activeImageIndex]?.url || primaryImage?.url || ""}
              alt={place.name}
              fill
              className="object-cover"
              priority
            />
            {place.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {place.images.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === activeImageIndex
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Quick Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleFavorite}
            disabled={favoriteLoading}
            className="bg-white/90 hover:bg-white"
          >
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white"
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Verified Badge */}
        {place.is_verified && (
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{place.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="capitalize">{place.category}</span>
                      {place.price_range && (
                        <>
                          <span>•</span>
                          <span>{place.price_range}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {place.average_rating > 0 && (
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl">
                      <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                      <div>
                        <span className="text-2xl font-bold">{place.average_rating.toFixed(1)}</span>
                        <p className="text-sm text-muted-foreground">{place.review_count} reviews</p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="flex items-start gap-2 text-muted-foreground mb-4">
                  <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>
                    {place.address}, {place.city}, {place.state} {place.zip_code}
                  </span>
                </p>

                {place.description && (
                  <p className="text-muted-foreground">{place.description}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  {amenityBadges.map((badge) => (
                    <Badge
                      key={badge.key}
                      variant={badge.color as "changing" | "highchair" | "stroller" | "family" | "quiet" | "secondary"}
                    >
                      <badge.icon className="h-3.5 w-3.5 mr-1.5" />
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Details */}
            <Tabs defaultValue="amenities" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({place.review_count})</TabsTrigger>
              </TabsList>

              <TabsContent value="amenities" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Changing Station Details */}
                      {place.amenities?.changing_station?.available && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Baby className="h-5 w-5 text-primary" />
                            Changing Station
                          </h3>
                          <div className="pl-7 space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Condition:</span>{" "}
                              <span className="capitalize">{place.amenities.changing_station.condition}</span>
                            </p>
                            <p>
                              <span className="font-medium">Locations:</span>{" "}
                              {place.amenities.changing_station.locations
                                .map((loc) => loc.replace("mens", "Men's").replace("womens", "Women's"))
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Noise Level */}
                      {place.amenities?.noise_level && place.amenities.noise_level !== "unknown" && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-primary" />
                            Noise Level
                          </h3>
                          <div className="pl-7 space-y-1 text-sm text-muted-foreground">
                            <p className="font-medium">{noiseLabels[place.amenities.noise_level].label}</p>
                            <p>{noiseLabels[place.amenities.noise_level].description}</p>
                          </div>
                        </div>
                      )}

                      {/* Parking */}
                      {place.amenities?.parking?.available && (
                        <div className="space-y-2">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Car className="h-5 w-5 text-primary" />
                            Parking
                          </h3>
                          <div className="pl-7 space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Type:</span>{" "}
                              {place.amenities.parking.type.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(", ")}
                            </p>
                            {place.amenities.parking.stroller_accessible && (
                              <p className="text-success">Stroller accessible</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* All Amenities List */}
                      <div className="md:col-span-2 space-y-2">
                        <h3 className="font-semibold mb-3">All Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {Object.entries(amenityDetails).map(([key, value]) => {
                            const isAvailable =
                              key === "changing_station"
                                ? place.amenities?.changing_station?.available
                                : place.amenities?.[key as keyof typeof place.amenities];
                            return (
                              <div
                                key={key}
                                className={`flex items-center gap-2 p-2 rounded-lg ${
                                  isAvailable
                                    ? "bg-success/10 text-success"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <value.icon className="h-4 w-4" />
                                <span className="text-sm">{value.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4 space-y-4">
                {user && (
                  <Link href={`/places/${place.slug}/review`}>
                    <Button className="w-full md:w-auto">
                      Write a Review
                    </Button>
                  </Link>
                )}
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your experience at this place!
                    </p>
                    {user ? (
                      <Link href={`/places/${place.slug}/review`}>
                        <Button>Write a Review</Button>
                      </Link>
                    ) : (
                      <Link href={`/auth/login?redirect=/places/${place.slug}/review`}>
                        <Button>Sign in to Review</Button>
                      </Link>
                    )}
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-lg">Contact & Hours</h3>

                {place.phone && (
                  <a
                    href={`tel:${place.phone}`}
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="h-5 w-5" />
                    <span>{place.phone}</span>
                  </a>
                )}

                {place.website && (
                  <a
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-muted-foreground hover:text-foreground"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="truncate">Visit Website</span>
                  </a>
                )}

                {place.hours ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Clock className="h-5 w-5" />
                      <span>Hours</span>
                    </div>
                    <div className="pl-8 text-sm space-y-1">
                      {Object.entries(place.hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day}</span>
                          <span className="text-muted-foreground">
                            {hours?.is_closed
                              ? "Closed"
                              : hours
                              ? `${hours.open} - ${hours.close}`
                              : "Hours not available"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>Hours not available</span>
                  </div>
                )}

                <Button className="w-full" variant="outline" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${place.address}, ${place.city}, ${place.state} ${place.zip_code}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Map Card */}
            <Card className="overflow-hidden">
              <div className="h-48">
                <MapView
                  places={[place]}
                  center={[place.longitude, place.latitude]}
                  zoom={14}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
