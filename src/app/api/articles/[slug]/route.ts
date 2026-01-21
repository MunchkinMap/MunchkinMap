import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const { slug } = await params;

    // Fetch article
    const { data: article, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        profiles:author_id(id, full_name, avatar_url)
      `
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: { code: "NOT_FOUND", message: "Article not found" } },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: { code: "DATABASE_ERROR", message: error.message } },
        { status: 500 }
      );
    }

    // Increment view count (fire and forget)
    supabase
      .from("articles")
      .update({ view_count: (article.view_count || 0) + 1 })
      .eq("id", article.id)
      .then(() => {});

    // Transform response
    const transformedArticle = {
      ...article,
      author: article.profiles,
    };
    delete (transformedArticle as Record<string, unknown>).profiles;

    return NextResponse.json({ data: transformedArticle });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
      { status: 500 }
    );
  }
}
