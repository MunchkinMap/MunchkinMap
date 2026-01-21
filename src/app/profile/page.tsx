"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button, Card, CardContent, Input, Label, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@/components/ui";
import { PlaceCard } from "@/components/places";
import type { Favorite, Review, Place, FamilyProfile, StrollerType } from "@/types";
import {
  User,
  MapPin,
  Star,
  Heart,
  Loader2,
  Edit,
  Baby,
  Users,
  Crown,
  Calendar,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading, signOut, refreshProfile } = useAuth();
  const supabase = useMemo(() => createClient(), []);

  const [familyProfile, setFamilyProfile] = useState<FamilyProfile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [numChildren, setNumChildren] = useState(0);
  const [strollerType, setStrollerType] = useState<StrollerType | "">("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
    }
  }, [profile]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user || !supabase) return;

      try {
        // Fetch family profile
        const { data: familyData } = await supabase
          .from("family_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (familyData) {
          setFamilyProfile(familyData);
          setFamilyName(familyData.family_name || "");
          setNumChildren(familyData.num_children || 0);
          setStrollerType(familyData.stroller_type || "");
        }

        // Fetch favorites with place details
        const { data: favoritesData } = await supabase
          .from("favorites")
          .select(`
            id,
            note,
            created_at,
            places:place_id(
              id,
              name,
              slug,
              category,
              address,
              city,
              state,
              average_rating,
              review_count,
              amenities,
              place_images(id, url, alt, is_primary)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (favoritesData) {
          setFavorites(
            favoritesData.map((fav) => ({
              id: fav.id,
              user_id: user.id,
              place_id: (fav.places as unknown as Place)?.id || "",
              note: fav.note,
              created_at: fav.created_at,
              place: {
                ...(fav.places as unknown as Place),
                images: (fav.places as unknown as Record<string, unknown>)?.place_images as Place["images"] || [],
              },
            })) as Favorite[]
          );
        }

        // Fetch user's reviews
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select(`
            *,
            places:place_id(id, name, slug)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (reviewsData) {
          setReviews(reviewsData as unknown as Review[]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchUserData();
    }
  }, [user, supabase]);

  const handleSaveProfile = async () => {
    if (!user || !supabase) return;

    setIsSaving(true);

    try {
      // Update user profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update or create family profile
      const familyData = {
        user_id: user.id,
        family_name: familyName || null,
        num_children: numChildren,
        stroller_type: strollerType || null,
      };

      if (familyProfile) {
        const { error } = await supabase
          .from("family_profiles")
          .update(familyData)
          .eq("id", familyProfile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("family_profiles")
          .insert(familyData);
        if (error) throw error;
      }

      await refreshProfile();
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-parchment flex items-center justify-center">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold mb-2">Sign in to view your profile</h1>
          <p className="text-muted-foreground">
            Access your saved places, reviews, and family settings.
          </p>
        </div>
        <Link href="/auth/login?redirect=/profile">
          <Button className="btn-primary">Sign In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Profile Header */}
        <div className="card-storybook mb-8">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-hero flex items-center justify-center overflow-hidden border-2 border-border">
                  {profile?.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={profile.full_name || "User"}
                      width={96}
                      height={96}
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>
                {profile?.is_premium && (
                  <div className="absolute -bottom-1 -right-1 bg-honey text-charcoal p-1.5 rounded-full shadow-soft">
                    <Crown className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="font-medium">Full Name</Label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="familyName" className="font-medium">Family Name (optional)</Label>
                        <Input
                          id="familyName"
                          placeholder="The Smiths"
                          value={familyName}
                          onChange={(e) => setFamilyName(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="numChildren" className="font-medium">Number of Children</Label>
                        <Input
                          id="numChildren"
                          type="number"
                          min={0}
                          max={20}
                          value={numChildren}
                          onChange={(e) => setNumChildren(parseInt(e.target.value) || 0)}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="strollerType" className="font-medium">Stroller Type</Label>
                        <select
                          id="strollerType"
                          className="w-full h-10 px-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                          value={strollerType}
                          onChange={(e) => setStrollerType(e.target.value as StrollerType)}
                        >
                          <option value="">Select type</option>
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="jogging">Jogging</option>
                          <option value="travel">Travel System</option>
                          <option value="umbrella">Umbrella</option>
                          <option value="none">No Stroller</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button onClick={handleSaveProfile} className="btn-primary" disabled={isSaving}>
                        {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)} className="rounded-full">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-display font-semibold">
                        {profile?.full_name || "Unnamed User"}
                      </h1>
                      {profile?.is_premium && (
                        <Badge className="badge-soft badge-honey">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-3">{user.email}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {familyProfile?.family_name && (
                        <span className="flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-terracotta" />
                          {familyProfile.family_name}
                        </span>
                      )}
                      {familyProfile?.num_children && familyProfile.num_children > 0 && (
                        <span className="flex items-center gap-1.5">
                          <Baby className="h-4 w-4 text-sage" />
                          {familyProfile.num_children} {familyProfile.num_children === 1 ? "child" : "children"}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-plum" />
                        Joined {new Date(profile?.created_at || "").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isEditing && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditing(true)}
                    className="rounded-xl hover:border-terracotta/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSignOut}
                    className="rounded-xl hover:border-destructive/30 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="w-full justify-start mb-6 bg-parchment rounded-full p-1">
            <TabsTrigger
              value="favorites"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:shadow-soft"
            >
              <Heart className="h-4 w-4" />
              Saved Places ({favorites.length})
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex items-center gap-2 rounded-full data-[state=active]:bg-card data-[state=active]:shadow-soft"
            >
              <Star className="h-4 w-4" />
              My Reviews ({reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            {favorites.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                {favorites.map((favorite) => (
                  favorite.place && (
                    <PlaceCard
                      key={favorite.id}
                      place={favorite.place as unknown as Place}
                      variant="horizontal"
                    />
                  )
                ))}
              </div>
            ) : (
              <div className="card-storybook p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-terracotta" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No saved places yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring and save your favorite baby-friendly spots!
                </p>
                <Link href="/places">
                  <Button className="btn-primary">
                    <MapPin className="h-4 w-4 mr-2" />
                    Explore Places
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="card-storybook">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link
                            href={`/places/${(review as unknown as { places?: { slug?: string } }).places?.slug}`}
                            className="font-display font-semibold hover:text-terracotta transition-colors"
                          >
                            {(review as unknown as { places?: { name?: string } }).places?.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-honey/10 text-honey px-2.5 py-1 rounded-full">
                          <Star className="h-4 w-4 fill-honey" />
                          <span className="font-semibold text-sm">{review.rating}</span>
                        </div>
                      </div>
                      {review.title && (
                        <h4 className="font-semibold mb-1">{review.title}</h4>
                      )}
                      <p className="text-muted-foreground line-clamp-3">{review.content}</p>
                    </CardContent>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card-storybook p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-honey/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-honey" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">No reviews yet</h3>
                <p className="text-muted-foreground mb-6">
                  Share your experiences to help other families!
                </p>
                <Link href="/places">
                  <Button className="btn-primary">
                    <MapPin className="h-4 w-4 mr-2" />
                    Find a Place to Review
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
