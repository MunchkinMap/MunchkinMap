import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ArticleCategory } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get("category") as ArticleCategory | null;
    const featured = searchParams.get("featured") === "true";
    const tag = searchParams.get("tag");
    const page = parseInt(searchParams.get("page") || "1");
    const perPage = Math.min(parseInt(searchParams.get("per_page") || "12"), 50);
    const offset = (page - 1) * perPage;

    // Build query
    let query = supabase
      .from("articles")
      .select(
        `
        id,
        title,
        slug,
        excerpt,
        cover_image,
        category,
        tags,
        target_ages,
        read_time_minutes,
        is_featured,
        published_at,
        view_count,
        profiles:author_id(id, full_name, avatar_url)
      `,
        { count: "exact" }
      )
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    // Filter by category
    if (category) {
      query = query.eq("category", category);
    }

    // Filter by featured
    if (featured) {
      query = query.eq("is_featured", true);
    }

    // Filter by tag
    if (tag) {
      query = query.contains("tags", [tag]);
    }

    // Pagination
    query = query.range(offset, offset + perPage - 1);

    const { data: articles, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Transform articles
    const transformedArticles = (articles || []).map((article) => ({
      ...article,
      author: article.profiles,
    }));

    const total = count || 0;
    const totalPages = Math.ceil(total / perPage);

    return NextResponse.json({
      data: transformedArticles,
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
