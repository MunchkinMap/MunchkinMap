import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch place with images
    const { data: place, error } = await supabase
      .from("places")
      .select(
        `
        *,
        place_images(id, url, alt, is_primary, uploaded_by, created_at),
        reviews(
          id,
          rating,
          title,
          content,
          visit_date,
          with_children_ages,
          helpful_count,
          amenity_ratings,
          is_verified_visit,
          created_at,
          profiles:user_id(id, full_name, avatar_url)
        )
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Place not found" } },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Transform the response
    const transformedPlace = {
      ...place,
      images: (place.place_images || []).map((img: Record<string, unknown>) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || place.name,
        is_primary: img.is_primary,
        uploaded_by: img.uploaded_by,
        created_at: img.created_at,
      })),
      reviews: (place.reviews || []).map((review: Record<string, unknown>) => ({
        ...review,
        user: review.profiles,
      })),
    };

    // Remove nested relations
    delete transformedPlace.place_images;

    return NextResponse.json({ data: transformedPlace });
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
        { error: { code: "UNAUTHORIZED", message: "You must be logged in" } },
        { status: 401 }
      );
    }

    // Get the place
    const { data: existingPlace, error: fetchError } = await supabase
      .from("places")
      .select("id, claimed_by")
      .eq("slug", slug)
      .single();

    if (fetchError || !existingPlace) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Place not found" } },
        { status: 404 }
      );
    }

    // Check if user is admin or place owner
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isAdmin = profile?.role === "admin";
    const isOwner = existingPlace.claimed_by === user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You do not have permission to edit this place" } },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Fields that can be updated
    const allowedFields = [
      "name",
      "description",
      "address",
      "city",
      "state",
      "zip_code",
      "phone",
      "website",
      "hours",
      "price_range",
      "amenities",
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "No valid fields to update" } },
        { status: 400 }
      );
    }

    // Update place
    const { data: place, error } = await supabase
      .from("places")
      .update(updates)
      .eq("id", existingPlace.id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Create contribution record for tracking
    await supabase.from("contributions").insert({
      place_id: existingPlace.id,
      user_id: user.id,
      type: "edit_place",
      data: { updates, previous: existingPlace },
      status: isAdmin ? "approved" : "pending",
    });

    return NextResponse.json({ data: place });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
