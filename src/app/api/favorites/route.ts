import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in to view favorites" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(parseInt(searchParams.get("per_page") || "20"), 100);
    const offset = (page - 1) * perPage;

    // Get favorites with place details
    const { data: favorites, error, count } = await supabase
      .from("favorites")
      .select(
        `
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
      `,
        { count: "exact" }
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + perPage - 1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Transform response
    const transformedFavorites = (favorites || []).map((fav) => {
      const placeData = fav.places as unknown as {
        id: string;
        name: string;
        slug: string;
        category: string;
        address: string;
        city: string;
        state: string;
        average_rating: number;
        review_count: number;
        amenities: unknown;
        place_images: Array<{ id: string; url: string; alt: string | null; is_primary: boolean }>;
      } | null;

      return {
        id: fav.id,
        note: fav.note,
        created_at: fav.created_at,
        place: placeData
          ? {
              ...placeData,
              images: placeData.place_images || [],
            }
          : null,
      };
    });

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: transformedFavorites,
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

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "You must be logged in to add favorites" } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { place_id, note } = body;

    if (!place_id) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "place_id is required" } },
        { status: 400 }
      );
    }

    // Check if place exists
    const { data: place, error: placeError } = await supabase
      .from("places")
      .select("id")
      .eq("id", place_id)
      .single();

    if (placeError || !place) {
      return NextResponse.json(
        { error: { code: "NOT_FOUND", message: "Place not found" } },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existingFav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("place_id", place_id)
      .single();

    if (existingFav) {
      return NextResponse.json(
        { error: { code: "DUPLICATE", message: "Place is already in your favorites" } },
        { status: 409 }
      );
    }

    // Add favorite
    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        place_id,
        note: note || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: favorite }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

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

    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("place_id");

    if (!placeId) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "place_id is required" } },
        { status: 400 }
      );
    }

    // Delete favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("place_id", placeId);

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
