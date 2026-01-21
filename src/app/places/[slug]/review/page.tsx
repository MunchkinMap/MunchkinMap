"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button, Card, CardContent, Input, Label, Textarea } from "@/components/ui";
import {
  Star,
  ChevronLeft,
  Loader2,
  Baby,
  SprayCan,
  Users,
  Volume2,
  Armchair,
} from "lucide-react";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  title: z.string().optional(),
  content: z.string().min(10, "Review must be at least 10 characters"),
  visit_date: z.string().optional(),
  with_children_ages: z.string().optional(),
  amenity_cleanliness: z.number().min(0).max(5).optional(),
  amenity_kid_friendliness: z.number().min(0).max(5).optional(),
  amenity_staff_helpfulness: z.number().min(0).max(5).optional(),
  amenity_changing_station: z.number().min(0).max(5).optional(),
  amenity_stroller_accessibility: z.number().min(0).max(5).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

function StarRating({
  value,
  onChange,
  size = "lg",
}: {
  value: number;
  onChange: (value: number) => void;
  size?: "sm" | "lg";
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`${size === "lg" ? "h-10 w-10" : "h-6 w-6"} ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  );
}

function AmenityRating({
  label,
  icon: Icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-sm">{label}</span>
      </div>
      <StarRating value={value} onChange={onChange} size="sm" />
    </div>
  );
}

export default function WriteReviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user, isLoading: authLoading } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      amenity_cleanliness: 0,
      amenity_kid_friendliness: 0,
      amenity_staff_helpfulness: 0,
      amenity_changing_station: 0,
      amenity_stroller_accessibility: 0,
    },
  });

  const rating = watch("rating");
  const amenityCleanliness = watch("amenity_cleanliness") || 0;
  const amenityKidFriendliness = watch("amenity_kid_friendliness") || 0;
  const amenityStaffHelpfulness = watch("amenity_staff_helpfulness") || 0;
  const amenityChangingStation = watch("amenity_changing_station") || 0;
  const amenityStrollerAccessibility = watch("amenity_stroller_accessibility") || 0;

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Parse children ages if provided
      const childrenAges = data.with_children_ages
        ? data.with_children_ages
            .split(",")
            .map((age) => parseInt(age.trim()))
            .filter((age) => !isNaN(age))
        : [];

      const response = await fetch(`/api/places/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: data.rating,
          title: data.title || null,
          content: data.content,
          visit_date: data.visit_date || null,
          with_children_ages: childrenAges,
          amenity_ratings: {
            cleanliness: data.amenity_cleanliness || null,
            kid_friendliness: data.amenity_kid_friendliness || null,
            staff_helpfulness: data.amenity_staff_helpfulness || null,
            changing_station_quality: data.amenity_changing_station || null,
            stroller_accessibility: data.amenity_stroller_accessibility || null,
          },
        }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error.message);
        return;
      }

      router.push(`/places/${slug}?review=success`);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <Star className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold text-center">Sign in to write a review</h1>
        <p className="text-muted-foreground text-center">
          You need to be logged in to share your experience.
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Link href={`/auth/login?redirect=/places/${slug}/review`}>
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const ratingLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Place
        </Button>

        <Card>
          <CardContent className="p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-2">Write a Review</h1>
            <p className="text-muted-foreground mb-6">
              Share your experience to help other families
            </p>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Overall Rating */}
              <div className="space-y-3">
                <Label className="text-base">Overall Rating *</Label>
                <div className="flex items-center gap-4">
                  <StarRating
                    value={rating}
                    onChange={(value) => setValue("rating", value)}
                  />
                  {rating > 0 && (
                    <span className="text-lg font-medium text-muted-foreground">
                      {ratingLabels[rating]}
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="text-sm text-destructive">{errors.rating.message}</p>
                )}
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Review Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="Summarize your experience"
                  {...register("title")}
                />
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <Textarea
                  id="content"
                  placeholder="Tell other families about your experience. What made this place great for kids? Any tips for parents?"
                  rows={6}
                  {...register("content")}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
              </div>

              {/* Visit Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="visit_date">Date of Visit (optional)</Label>
                  <Input
                    id="visit_date"
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
                    {...register("visit_date")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="with_children_ages">Children&apos;s Ages (optional)</Label>
                  <Input
                    id="with_children_ages"
                    placeholder="e.g., 2, 5, 8"
                    {...register("with_children_ages")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple ages with commas
                  </p>
                </div>
              </div>

              {/* Amenity Ratings */}
              <div className="space-y-3">
                <Label className="text-base">Rate Specific Amenities (optional)</Label>
                <Card className="bg-muted/50">
                  <CardContent className="p-4 divide-y">
                    <AmenityRating
                      label="Cleanliness"
                      icon={SprayCan}
                      value={amenityCleanliness}
                      onChange={(v) => setValue("amenity_cleanliness", v)}
                    />
                    <AmenityRating
                      label="Kid Friendliness"
                      icon={Baby}
                      value={amenityKidFriendliness}
                      onChange={(v) => setValue("amenity_kid_friendliness", v)}
                    />
                    <AmenityRating
                      label="Staff Helpfulness"
                      icon={Users}
                      value={amenityStaffHelpfulness}
                      onChange={(v) => setValue("amenity_staff_helpfulness", v)}
                    />
                    <AmenityRating
                      label="Changing Station"
                      icon={Baby}
                      value={amenityChangingStation}
                      onChange={(v) => setValue("amenity_changing_station", v)}
                    />
                    <AmenityRating
                      label="Stroller Accessibility"
                      icon={Armchair}
                      value={amenityStrollerAccessibility}
                      onChange={(v) => setValue("amenity_stroller_accessibility", v)}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" loading={isSubmitting}>
                  Submit Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
