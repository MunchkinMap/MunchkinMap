"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import type { Article, ArticleCategory } from "@/types";
import {
  BookOpen,
  Clock,
  Eye,
  ChevronRight,
  Loader2,
  Baby,
  Moon,
  Heart,
  Stethoscope,
  Plane,
  ShoppingBag,
  Lightbulb,
  Users,
  Sparkles,
  Brain,
  Utensils,
} from "lucide-react";

const categoryInfo: Record<ArticleCategory, { label: string; icon: React.ElementType; color: string }> = {
  feeding: { label: "Feeding", icon: Utensils, color: "bg-orange-100 text-orange-800" },
  sleep: { label: "Sleep", icon: Moon, color: "bg-indigo-100 text-indigo-800" },
  development: { label: "Development", icon: Brain, color: "bg-purple-100 text-purple-800" },
  health: { label: "Health", icon: Stethoscope, color: "bg-red-100 text-red-800" },
  activities: { label: "Activities", icon: Sparkles, color: "bg-yellow-100 text-yellow-800" },
  travel: { label: "Travel", icon: Plane, color: "bg-sky-100 text-sky-800" },
  gear: { label: "Gear", icon: ShoppingBag, color: "bg-emerald-100 text-emerald-800" },
  parenting_tips: { label: "Parenting Tips", icon: Lightbulb, color: "bg-amber-100 text-amber-800" },
  dad_life: { label: "Dad Life", icon: Users, color: "bg-blue-100 text-blue-800" },
  mom_life: { label: "Mom Life", icon: Heart, color: "bg-pink-100 text-pink-800" },
  relationships: { label: "Relationships", icon: Users, color: "bg-rose-100 text-rose-800" },
  mental_health: { label: "Mental Health", icon: Brain, color: "bg-teal-100 text-teal-800" },
};

// Mock articles for demo - in production, fetch from API
const mockArticles: Article[] = [
  {
    id: "1",
    title: "10 Best Stroller-Friendly Walking Trails for Families",
    slug: "best-stroller-friendly-trails",
    excerpt: "Discover the most scenic and accessible trails that are perfect for family adventures with young children.",
    content: "",
    cover_image: null,
    author_id: "1",
    author: { id: "1", full_name: "Sarah Johnson", avatar_url: null },
    category: "activities",
    tags: ["outdoors", "strollers", "hiking"],
    target_ages: [{ min_months: 0, max_months: 48 }],
    read_time_minutes: 8,
    is_featured: true,
    is_published: true,
    published_at: "2024-01-15T10:00:00Z",
    view_count: 1250,
    created_at: "2024-01-10T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    title: "The Ultimate Guide to Restaurant Dining with Toddlers",
    slug: "restaurant-dining-toddlers-guide",
    excerpt: "Expert tips and tricks for stress-free restaurant experiences with your little ones.",
    content: "",
    cover_image: null,
    author_id: "2",
    author: { id: "2", full_name: "Mike Chen", avatar_url: null },
    category: "parenting_tips",
    tags: ["dining", "toddlers", "tips"],
    target_ages: [{ min_months: 12, max_months: 36 }],
    read_time_minutes: 6,
    is_featured: true,
    is_published: true,
    published_at: "2024-01-12T10:00:00Z",
    view_count: 980,
    created_at: "2024-01-08T10:00:00Z",
    updated_at: "2024-01-12T10:00:00Z",
  },
  {
    id: "3",
    title: "Sleep Training: A Dad's Perspective",
    slug: "sleep-training-dads-perspective",
    excerpt: "One father shares his journey through sleep training and the lessons he learned along the way.",
    content: "",
    cover_image: null,
    author_id: "3",
    author: { id: "3", full_name: "James Wilson", avatar_url: null },
    category: "dad_life",
    tags: ["sleep", "dad", "personal"],
    target_ages: [{ min_months: 4, max_months: 18 }],
    read_time_minutes: 10,
    is_featured: false,
    is_published: true,
    published_at: "2024-01-10T10:00:00Z",
    view_count: 756,
    created_at: "2024-01-05T10:00:00Z",
    updated_at: "2024-01-10T10:00:00Z",
  },
  {
    id: "4",
    title: "Traveling with Infants: Essential Packing List",
    slug: "traveling-infants-packing-list",
    excerpt: "Never forget the essentials again with our comprehensive packing guide for traveling with babies.",
    content: "",
    cover_image: null,
    author_id: "1",
    author: { id: "1", full_name: "Sarah Johnson", avatar_url: null },
    category: "travel",
    tags: ["travel", "packing", "babies"],
    target_ages: [{ min_months: 0, max_months: 12 }],
    read_time_minutes: 7,
    is_featured: true,
    is_published: true,
    published_at: "2024-01-08T10:00:00Z",
    view_count: 1432,
    created_at: "2024-01-03T10:00:00Z",
    updated_at: "2024-01-08T10:00:00Z",
  },
];

function ArticleCard({ article, featured = false }: { article: Article; featured?: boolean }) {
  const categoryData = categoryInfo[article.category];
  const CategoryIcon = categoryData.icon;

  if (featured) {
    return (
      <Link href={`/resources/${article.slug}`}>
        <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
          <div className="relative aspect-[16/9] bg-gradient-sunset">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CategoryIcon className="h-16 w-16 text-coral/30" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className={categoryData.color}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {categoryData.label}
              </Badge>
            </div>
          </div>
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{article.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.read_time_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {article.view_count.toLocaleString()}
                </span>
              </div>
              <span className="text-primary font-medium flex items-center gap-1">
                Read <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/resources/${article.slug}`}>
      <Card className="overflow-hidden hover:shadow-md transition-all">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-sunset">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CategoryIcon className="h-10 w-10 text-coral/30" />
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-4">
            <Badge variant="outline" className="mb-2 text-xs">
              {categoryData.label}
            </Badge>
            <h3 className="font-semibold mb-1 line-clamp-2">{article.title}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.read_time_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {article.view_count.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default function ResourcesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "all">("all");

  // In production, fetch articles from API
  // useEffect(() => {
  //   async function fetchArticles() {
  //     setLoading(true);
  //     const response = await fetch(`/api/articles${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`);
  //     const data = await response.json();
  //     setArticles(data.data);
  //     setLoading(false);
  //   }
  //   fetchArticles();
  // }, [selectedCategory]);

  const featuredArticles = articles.filter((a) => a.is_featured);
  const filteredArticles =
    selectedCategory === "all"
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  const categories: (ArticleCategory | "all")[] = [
    "all",
    "parenting_tips",
    "activities",
    "travel",
    "feeding",
    "sleep",
    "gear",
    "health",
    "development",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-peach/50 rounded-full px-4 py-2 mb-6">
            <BookOpen className="h-5 w-5 text-coral" />
            <span className="text-sm font-medium">Parenting Resources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-sunset">Expert Tips</span> for Your Journey
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Helpful articles, guides, and resources curated for parents of young children.
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="container mx-auto px-4 -mt-12 relative z-10 mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.slice(0, 3).map((article) => (
              <ArticleCard key={article.id} article={article} featured />
            ))}
          </div>
        </div>
      )}

      {/* All Articles */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl font-bold">All Articles</h2>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => {
              const isAll = category === "all";
              const info = isAll ? null : categoryInfo[category];
              const Icon = info?.icon || BookOpen;

              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0"
                >
                  {!isAll && <Icon className="h-4 w-4 mr-1.5" />}
                  {isAll ? "All" : info?.label}
                </Button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory !== "all"
                ? "Try selecting a different category."
                : "Check back soon for new content!"}
            </p>
            {selectedCategory !== "all" && (
              <Button onClick={() => setSelectedCategory("all")}>View All Articles</Button>
            )}
          </Card>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-sunset py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Get the latest parenting tips and resources delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-11 px-4 rounded-lg border bg-background"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
