"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Card, CardContent, Badge } from "@/components/ui";
import type { Article, ArticleCategory } from "@/types";
import {
  BookOpen,
  Clock,
  Eye,
  ChevronRight,
  Loader2,
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
  ArrowRight,
} from "lucide-react";

const categoryInfo: Record<ArticleCategory, { label: string; icon: React.ElementType; color: string }> = {
  feeding: { label: "Feeding", icon: Utensils, color: "bg-honey/10 text-honey border-honey/20" },
  sleep: { label: "Sleep", icon: Moon, color: "bg-plum/10 text-plum border-plum/20" },
  development: { label: "Development", icon: Brain, color: "bg-terracotta/10 text-terracotta border-terracotta/20" },
  health: { label: "Health", icon: Stethoscope, color: "bg-destructive/10 text-destructive border-destructive/20" },
  activities: { label: "Activities", icon: Sparkles, color: "bg-honey/10 text-honey border-honey/20" },
  travel: { label: "Travel", icon: Plane, color: "bg-sky/10 text-sky border-sky/20" },
  gear: { label: "Gear", icon: ShoppingBag, color: "bg-sage/10 text-sage border-sage/20" },
  parenting_tips: { label: "Parenting Tips", icon: Lightbulb, color: "bg-honey/10 text-honey border-honey/20" },
  dad_life: { label: "Dad Life", icon: Users, color: "bg-sky/10 text-sky border-sky/20" },
  mom_life: { label: "Mom Life", icon: Heart, color: "bg-terracotta-light/10 text-terracotta-light border-terracotta-light/20" },
  relationships: { label: "Relationships", icon: Users, color: "bg-plum/10 text-plum border-plum/20" },
  mental_health: { label: "Mental Health", icon: Brain, color: "bg-sage/10 text-sage border-sage/20" },
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
        <div className="card-storybook overflow-hidden h-full group">
          <div className="relative aspect-[16/9] bg-gradient-hero">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CategoryIcon className="h-16 w-16 text-terracotta/20" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge className={`${categoryData.color} border`}>
                <CategoryIcon className="h-3 w-3 mr-1" />
                {categoryData.label}
              </Badge>
            </div>
          </div>
          <CardContent className="p-5">
            <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2 group-hover:text-terracotta transition-colors">
              {article.title}
            </h3>
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
              <span className="text-terracotta font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                Read <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </CardContent>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/resources/${article.slug}`}>
      <div className="card-storybook overflow-hidden group">
        <div className="flex">
          <div className="relative w-32 h-32 flex-shrink-0 bg-gradient-hero">
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <CategoryIcon className="h-10 w-10 text-terracotta/20" />
              </div>
            )}
          </div>
          <CardContent className="flex-1 p-4">
            <Badge variant="outline" className={`mb-2 text-xs ${categoryData.color} border`}>
              {categoryData.label}
            </Badge>
            <h3 className="font-display font-semibold mb-1 line-clamp-2 group-hover:text-terracotta transition-colors">
              {article.title}
            </h3>
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
      </div>
    </Link>
  );
}

export default function ResourcesPage() {
  const [articles] = useState<Article[]>(mockArticles);
  const [loading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | "all">("all");

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
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="bg-gradient-hero py-16 md:py-24 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-honey/10 blob-1 animate-float-gentle" />
        <div className="absolute bottom-10 left-10 w-24 h-24 bg-sage/10 blob-2 animate-float-slow" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="badge-soft badge-terracotta inline-flex mb-6">
            <BookOpen className="h-4 w-4" />
            Parenting Resources
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4">
            <span className="text-gradient-warm">Expert Tips</span> for Your Journey
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Helpful articles, guides, and resources curated for parents of young children.
          </p>
        </div>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="container mx-auto px-4 -mt-12 relative z-10 mb-12">
          <h2 className="text-2xl font-display font-semibold mb-6">Featured Articles</h2>
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
          <h2 className="text-2xl font-display font-semibold">All Articles</h2>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                  className={`flex-shrink-0 rounded-full ${
                    selectedCategory === category
                      ? "bg-terracotta hover:bg-terracotta/90 text-white"
                      : "hover:border-terracotta/30"
                  }`}
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
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        ) : filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <Card className="card-storybook p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-4">
              {selectedCategory !== "all"
                ? "Try selecting a different category."
                : "Check back soon for new content!"}
            </p>
            {selectedCategory !== "all" && (
              <Button
                onClick={() => setSelectedCategory("all")}
                className="btn-primary"
              >
                View All Articles
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Newsletter CTA */}
      <div className="bg-gradient-terracotta py-16">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">Stay Updated</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Get the latest parenting tips and resources delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-5 rounded-full border-2 border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:outline-none focus:border-white/40 backdrop-blur-sm"
            />
            <Button className="h-12 px-6 rounded-full bg-white text-terracotta font-semibold hover:bg-white/90 transition-colors">
              Subscribe
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
