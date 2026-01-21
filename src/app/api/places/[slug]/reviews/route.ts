import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;
    const { searchParams } = new URL(request.url);

    // Get place ID from slug
    const { data: place, error: placeError } = await supabase
      .from("places")
      .select("id")
      .eq("slug", slug)
      .single();

    if (placeError || !place) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Place not found" } },
        { status: 404 }
      );
    }

    // Pagination and sorting
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(parseInt(searchParams.get("per_page") || "10"), 50);
    const offset = (page - 1) * perPage;
    const sortBy = searchParams.get("sort") || "newest";

    // Build query
    let query = supabase
      .from("reviews")
      .select(
        `
        *,
        profiles:user_id(id, full_name, avatar_url),
        review_images(id, url, caption)
      `,
        { count: "exact" }
      )
      .eq("place_id", place.id);

    // Sorting
    switch (sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "highest":
        query = query.order("rating", { ascending: false });
        break;
      case "lowest":
        query = query.order("rating", { ascending: true });
        break;
      case "helpful":
        query = query.order("helpful_count", { ascending: false });
        break;
      default: // newest
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + perPage - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Transform reviews
    const transformedReviews = (reviews || []).map((review) => ({
      ...review,
      user: review.profiles,
      images: review.review_images || [],
    }));

    // Remove nested relations
    transformedReviews.forEach((review) => {
      delete (review as Record<string, unknown>).profiles;
      delete (review as Record<string, unknown>).review_images;
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: transformedReviews,
      pagination: {
        page,
        per_page: perPage,
        total,
        total_pages: totalPages,
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in to submit a review" } },
        { status: 401 }
      );
    }

    // Get place ID from slug
    const { data: place, error: placeError } = await supabase
      .from("places")
      .select("id")
      .eq("slug", slug)
      .single();

    if (placeError || !place) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Place not found" } },
        { status: 404 }
      );
    }

    // Check if user already reviewed this place
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("place_id", place.id)
      .eq("user_id", user.id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: { code: "DUPLICATE_REVIEW", message: "You have already reviewed this place" } },
        { status: 409 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { rating, content } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Rating must be between 1 and 5" } },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 10) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Review content must be at least 10 characters" } },
        { status: 400 }
      );
    }

    // Create review
    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        place_id: place.id,
        user_id: user.id,
        rating,
        title: body.title || null,
        content: content.trim(),
        visit_date: body.visit_date || null,
        with_children_ages: body.with_children_ages || [],
        amenity_ratings: body.amenity_ratings || {},
        is_verified_visit: false,
      })
      .select(
        `
        *,
        profiles:user_id(id, full_name, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Transform response
    const transformedReview = {
      ...review,
      user: review.profiles,
      images: [],
    };
    delete (transformedReview as Record<string, unknown>).profiles;

    return NextResponse.json({ data: transformedReview }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
