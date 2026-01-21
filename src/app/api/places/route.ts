import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Place, PlaceCategory, PriceRange, NoiseLevel, AmenityType, SortOption } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const query = searchParams.get("q") || "";
    const categories = searchParams.getAll("category") as PlaceCategory[];
    const amenities = searchParams.getAll("amenity") as AmenityType[];
    const priceRanges = searchParams.getAll("price") as PriceRange[];
    const noiseLevels = searchParams.getAll("noise") as NoiseLevel[];
    const minRating = parseFloat(searchParams.get("min_rating") || "0");
    const isVerified = searchParams.get("verified") === "true";
    const hasPhotos = searchParams.get("has_photos") === "true";
    const sortBy = (searchParams.get("sort") || "relevance") as SortOption;

    // Location-based search parameters
    const lat = parseFloat(searchParams.get("lat") || "0");
    const lng = parseFloat(searchParams.get("lng") || "0");
    const radius = parseFloat(searchParams.get("radius") || "10"); // miles
    const hasLocation = lat !== 0 && lng !== 0;

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(parseInt(searchParams.get("per_page") || "20"), 100);
    const offset = (page - 1) * perPage;

    // Build query
    let dbQuery = supabase
      .from("places")
      .select("*, place_images(id, url, alt, is_primary)", { count: "exact" });

    // Text search
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%,address.ilike.%${query}%,city.ilike.%${query}%`
      );
    }

    // Category filter
    if (categories.length > 0) {
      dbQuery = dbQuery.in("category", categories);
    }

    // Price range filter
    if (priceRanges.length > 0) {
      dbQuery = dbQuery.in("price_range", priceRanges);
    }

    // Minimum rating filter
    if (minRating > 0) {
      dbQuery = dbQuery.gte("average_rating", minRating);
    }

    // Verified filter
    if (isVerified) {
      dbQuery = dbQuery.eq("is_verified", true);
    }

    // Amenity filters (JSON field)
    amenities.forEach((amenity) => {
      switch (amenity) {
        case "changing_station":
          dbQuery = dbQuery.not("amenities->changing_station", "is", null);
          break;
        case "quiet":
          dbQuery = dbQuery.eq("amenities->noise_level", "quiet");
          break;
        case "parking":
          dbQuery = dbQuery.not("amenities->parking", "is", null);
          break;
        default:
          // Boolean amenities
          dbQuery = dbQuery.eq(`amenities->${amenity}`, true);
      }
    });

    // Noise level filter
    if (noiseLevels.length > 0) {
      dbQuery = dbQuery.in("amenities->noise_level", noiseLevels);
    }

    // Sorting
    switch (sortBy) {
      case "rating":
        dbQuery = dbQuery.order("average_rating", { ascending: false });
        break;
      case "reviews":
        dbQuery = dbQuery.order("review_count", { ascending: false });
        break;
      case "newest":
        dbQuery = dbQuery.order("created_at", { ascending: false });
        break;
      case "alphabetical":
        dbQuery = dbQuery.order("name", { ascending: true });
        break;
      case "distance":
        // Distance sorting requires RPC function (handled below)
        if (!hasLocation) {
          dbQuery = dbQuery.order("average_rating", { ascending: false });
        }
        break;
      default:
        // Relevance - prioritize rating and review count
        dbQuery = dbQuery
          .order("average_rating", { ascending: false })
          .order("review_count", { ascending: false });
    }

    // Pagination
    dbQuery = dbQuery.range(offset, offset + perPage - 1);

    // Execute query
    const { data: places, error, count } = await dbQuery;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // If we have location and need distance sorting/filtering, use PostGIS
    let processedPlaces = places || [];

    if (hasLocation && radius > 0) {
      // Filter by distance using Haversine formula (in miles)
      processedPlaces = processedPlaces.filter((place) => {
        const distance = calculateDistance(
          lat,
          lng,
          place.latitude,
          place.longitude
        );
        return distance <= radius;
      });

      // Sort by distance if requested
      if (sortBy === "distance") {
        processedPlaces = processedPlaces.sort((a, b) => {
          const distA = calculateDistance(lat, lng, a.latitude, a.longitude);
          const distB = calculateDistance(lat, lng, b.latitude, b.longitude);
          return distA - distB;
        });
      }

      // Add distance to each place
      processedPlaces = processedPlaces.map((place) => ({
        ...place,
        distance: calculateDistance(lat, lng, place.latitude, place.longitude),
      }));
    }

    // Filter by has_photos if requested
    if (hasPhotos) {
      processedPlaces = processedPlaces.filter(
        (place) => place.place_images && place.place_images.length > 0
      );
    }

    // Transform places to include images array
    const transformedPlaces: Place[] = processedPlaces.map((place) => ({
      ...place,
      images: (place.place_images || []).map((img: { id: string; url: string; alt: string | null; is_primary: boolean }) => ({
        id: img.id,
        url: img.url,
        alt: img.alt || place.name,
        is_primary: img.is_primary,
        uploaded_by: "",
        created_at: "",
      })),
    }));

    const total = count || transformedPlaces.length;
    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: transformedPlaces,
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
        { error: { code: "UNAUTHORIZED", message: "You must be logged in to add a place" } },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, category, address, city, state, latitude, longitude } = body;

    if (!name || !category || !address || !city || !state || !latitude || !longitude) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Generate slug
    const slug = generateSlug(name, city);

    // Check if slug already exists
    const { data: existingPlace } = await supabase
      .from("places")
      .select("id")
      .eq("slug", slug)
      .single();

    const finalSlug = existingPlace
      ? `${slug}-${Date.now().toString(36)}`
      : slug;

    // Insert place
    const { data: place, error } = await supabase
      .from("places")
      .insert({
        name,
        slug: finalSlug,
        description: body.description || null,
        category,
        address,
        city,
        state,
        zip_code: body.zip_code || null,
        country: body.country || "USA",
        latitude,
        longitude,
        phone: body.phone || null,
        website: body.website || null,
        hours: body.hours || null,
        price_range: body.price_range || null,
        amenities: body.amenities || {
          changing_station: null,
          high_chairs: false,
          kids_menu: false,
          stroller_friendly: false,
          outdoor_seating: false,
          play_area: false,
          nursing_room: false,
          family_restroom: false,
          noise_level: "unknown",
          wheelchair_accessible: false,
          parking: null,
          additional: [],
        },
        is_verified: false,
        is_claimed: false,
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

    // Create contribution record
    await supabase.from("contributions").insert({
      place_id: place.id,
      user_id: user.id,
      type: "new_place",
      data: { original: body },
      status: "pending",
    });

    return NextResponse.json({ data: place }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance in miles
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

function generateSlug(name: string, city: string): string {
  return `${name}-${city}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
