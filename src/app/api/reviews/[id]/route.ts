import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    const { data: review, error } = await supabase
      .from("reviews")
      .select(
        `
        *,
        profiles:user_id(id, full_name, avatar_url),
        review_images(id, url, caption),
        places:place_id(id, name, slug)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Review not found" } },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    const transformedReview = {
      ...review,
      user: review.profiles,
      images: review.review_images || [],
      place: review.places,
    };
    delete (transformedReview as Record<string, unknown>).profiles;
    delete (transformedReview as Record<string, unknown>).review_images;
    delete (transformedReview as Record<string, unknown>).places;

    return NextResponse.json({ data: transformedReview });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in" } },
        { status: 401 }
      );
    }

    // Get the review
    const { data: existingReview, error: fetchError } = await supabase
      .from("reviews")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingReview) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Review not found" } },
        { status: 404 }
      );
    }

    // Check ownership
    if (existingReview.user_id !== user.id) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only edit your own reviews" } },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Fields that can be updated
    const allowedFields = [
      "rating",
      "title",
      "content",
      "visit_date",
      "with_children_ages",
      "amenity_ratings",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    // Validate rating if provided
    if (updates.rating && (updates.rating as number < 1 || updates.rating as number > 5)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Rating must be between 1 and 5" } },
        { status: 400 }
      );
    }

    // Validate content if provided
    if (updates.content && (updates.content as string).trim().length < 10) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Review content must be at least 10 characters" } },
        { status: 400 }
      );
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "No valid fields to update" } },
        { status: 400 }
      );
    }

    // Update review
    const { data: review, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select(
        `
        *,
        profiles:user_id(id, full_name, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    const transformedReview = {
      ...review,
      user: review.profiles,
    };
    delete (transformedReview as Record<string, unknown>).profiles;

    return NextResponse.json({ data: transformedReview });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id } = await params;

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in" } },
        { status: 401 }
      );
    }

    // Get the review
    const { data: existingReview, error: fetchError } = await supabase
      .from("reviews")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingReview) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Review not found" } },
        { status: 404 }
      );
    }

    // Check if user is admin or review owner
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isOwner = existingReview.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You can only delete your own reviews" } },
        { status: 403 }
      );
    }

    // Delete review (cascade will handle review_images)
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
