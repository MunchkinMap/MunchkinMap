"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  MapPin,
  Search,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
  Heart,
  BookOpen,
  Tag,
  Users,
  ArrowRight,
  Check,
  Play,
  Zap,
  Globe,
  Clock,
} from "lucide-react";

const categories = [
  { name: "Restaurants", emoji: "🍽️", href: "/places?category=restaurant", gradient: "from-orange-400 to-rose-500" },
  { name: "Cafes", emoji: "☕", href: "/places?category=cafe", gradient: "from-amber-400 to-orange-500" },
  { name: "Parks", emoji: "🌳", href: "/places?category=park", gradient: "from-emerald-400 to-teal-500" },
  { name: "Playgrounds", emoji: "🎠", href: "/places?category=playground", gradient: "from-violet-400 to-purple-500" },
  { name: "Museums", emoji: "🏛️", href: "/places?category=museum", gradient: "from-blue-400 to-indigo-500" },
  { name: "Shopping", emoji: "🛍️", href: "/places?category=shopping", gradient: "from-pink-400 to-rose-500" },
];

const features = [
  {
    icon: MapPin,
    title: "Dad-Approved Spots",
    description: "Find places with changing tables in the men's room. Because dads change diapers too!",
    emoji: "👨‍🍼",
    gradient: "from-coral to-rose-500",
  },
  {
    icon: Shield,
    title: "Verified by Parents",
    description: "Real reviews from real parents. No mystery, no surprises when you arrive.",
    emoji: "✅",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: BookOpen,
    title: "Resources & Guides",
    description: "From sleep tips to milestone tracking. Your parenting knowledge hub.",
    emoji: "📖",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    icon: Tag,
    title: "Family Deals",
    description: "Exclusive discounts on gear, dining, and activities for your family.",
    emoji: "🏷️",
    gradient: "from-amber-400 to-orange-500",
  },
  {
    icon: Users,
    title: "Parent Squads",
    description: "Connect with local parents. Dad groups, playdates, and more.",
    emoji: "👨‍👩‍👧‍👦",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    icon: Heart,
    title: "Personalized For You",
    description: "Recommendations based on your kids' ages and your family's preferences.",
    emoji: "💝",
    gradient: "from-coral to-orange-500",
  },
];

const testimonials = [
  {
    quote: "Finally! An app that tells me if there's a changing table in the men's room. Total game changer for solo dad outings.",
    author: "Mike R.",
    role: "Dad of twins",
    avatar: "👨",
    rating: 5,
    location: "Austin, TX",
  },
  {
    quote: "We moved to a new city and MunchkinMap helped us find our new favorite family brunch spot within a week!",
    author: "Sarah K.",
    role: "Mom of 1",
    avatar: "👩",
    rating: 5,
    location: "Seattle, WA",
  },
  {
    quote: "The parent community is so supportive. Found a local dad group through here and we meet up every Saturday now.",
    author: "James T.",
    role: "First-time dad",
    avatar: "👨‍🦱",
    rating: 5,
    location: "Denver, CO",
  },
];

const stats = [
  { value: "10K+", label: "Places Listed", icon: MapPin },
  { value: "50K+", label: "Happy Parents", icon: Users },
  { value: "100K+", label: "Reviews", icon: Star },
  { value: "200+", label: "Cities", icon: Globe },
];

const premiumPerks = [
  { text: "Personalized family feed", icon: Sparkles },
  { text: "Save unlimited favorites", icon: Heart },
  { text: "Offline access", icon: Globe },
  { text: "Ad-free experience", icon: Zap },
  { text: "Priority support", icon: Clock },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section - Immersive Full Screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-peach via-lavender/50 to-background" />

        {/* Animated floating shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large decorative circles */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-coral/20 to-golden/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-lavender to-peach/50 rounded-full blur-3xl" />

          {/* Floating blobs with different animations */}
          <div className="absolute top-[15%] left-[8%] w-24 h-24 bg-gradient-to-br from-coral/30 to-rose-400/30 blob-1 animate-float" />
          <div className="absolute top-[25%] right-[12%] w-20 h-20 bg-gradient-to-br from-golden/40 to-amber-400/40 blob-2 animate-float-delay-1" />
          <div className="absolute bottom-[25%] left-[15%] w-32 h-32 bg-gradient-to-br from-lavender/60 to-violet-300/60 blob-3 animate-float-delay-2" />
          <div className="absolute bottom-[15%] right-[8%] w-16 h-16 bg-gradient-to-br from-mint/30 to-emerald-400/30 blob-4 animate-float-reverse" />
          <div className="absolute top-[40%] right-[25%] w-12 h-12 bg-gradient-to-br from-pink-300/40 to-rose-400/40 blob-1 animate-float" />

          {/* Decorative dots pattern */}
          <div className="absolute top-20 left-20 w-40 h-40 deco-dots opacity-30" />
          <div className="absolute bottom-32 right-32 w-60 h-60 deco-dots opacity-20" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Floating badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg border border-white/50 animate-slide-down">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-rose-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white">M</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-golden to-amber-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white">D</div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-mint to-emerald-500 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white">P</div>
                </div>
                <span className="text-sm font-semibold text-foreground/80">Join 50,000+ parents exploring together</span>
                <Sparkles className="h-4 w-4 text-golden" />
              </div>
            </div>

            {/* Main headline with animated text */}
            <div className="text-center mb-8">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1]">
                <span className="block animate-slide-up">Family adventures</span>
                <span className="block animate-slide-up text-gradient-sunset" style={{ animationDelay: '0.1s' }}>
                  start here
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.2s' }}>
                Discover baby-friendly restaurants, parks, and hangouts.
              </p>
              <p className="text-base sm:text-lg font-semibold text-foreground animate-slide-up" style={{ animationDelay: '0.25s' }}>
                Yes, even ones with changing tables in the men&apos;s room. 👨‍🍼
              </p>
            </div>

            {/* Search Bar - Large and prominent */}
            <div className="max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <div className="search-playful p-2 flex items-center">
                  <div className="flex-1 flex items-center">
                    <Search className="h-6 w-6 text-muted-foreground ml-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Try 'brunch with play area' or 'quiet cafe for naps'"
                      className="flex-1 h-14 px-4 bg-transparent text-lg focus:outline-none placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <Link href={`/places${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}>
                    <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-coral to-rose-500 hover:from-coral/90 hover:to-rose-500/90 text-white font-bold text-base shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:shadow-coral/30 hover:-translate-y-0.5">
                      <MapPin className="h-5 w-5 mr-2" />
                      Explore
                    </Button>
                  </Link>
                </div>
                {/* Quick suggestions */}
                <div className="flex flex-wrap justify-center gap-2 mt-4 text-sm">
                  <span className="text-muted-foreground">Popular:</span>
                  {["Brunch spots", "Indoor playgrounds", "Kid-friendly cafes"].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setSearchQuery(suggestion)}
                      className="px-3 py-1 rounded-full bg-white/60 hover:bg-white text-foreground/70 hover:text-foreground transition-all border border-white/50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Pills - Interactive */}
            <div className="flex flex-wrap justify-center gap-3 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {categories.map((category, index) => (
                <Link key={category.name} href={category.href}>
                  <button
                    className="group relative flex items-center gap-2.5 bg-white/80 backdrop-blur-sm hover:bg-white px-5 py-3 rounded-full shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-white/50"
                    style={{ animationDelay: `${0.5 + index * 0.05}s` }}
                  >
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{category.emoji}</span>
                    <span className="font-semibold text-foreground/80 group-hover:text-foreground">{category.name}</span>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 60C180 100 360 20 540 60C720 100 900 20 1080 60C1260 100 1350 40 1440 60V120H0V60Z"
              fill="hsl(var(--peach))"
            />
          </svg>
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="bg-peach py-12 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 deco-dots opacity-10" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-coral/10 mb-3 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-coral" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-coral mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section - Modern Bento Grid */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-peach via-background to-background relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-40 -left-20 w-60 h-60 bg-lavender/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-peach/50 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-coral/10 text-coral rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Sparkles className="h-4 w-4" />
              Everything you need
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              More than just a{" "}
              <span className="relative inline-block">
                <span className="relative z-10">place finder</span>
                <svg className="absolute -bottom-2 left-0 w-full h-4" viewBox="0 0 200 16" fill="none">
                  <path d="M0 12C40 4 80 16 120 8C160 0 180 12 200 8" stroke="hsl(var(--golden))" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your complete parenting sidekick for navigating the world with little ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 overflow-hidden"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-4xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">{feature.emoji}</span>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-coral transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-background to-lavender/20">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full">
          <div className="absolute top-1/4 left-0 w-72 h-72 bg-peach/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-lavender/40 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-golden/10 text-golden-dark rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <Play className="h-4 w-4" />
              How it works
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Three steps to your next{" "}
              <span className="text-gradient-sunset">adventure</span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: "01",
                  emoji: "🔍",
                  title: "Search or Browse",
                  description: "Tell us what you're looking for or explore nearby family-friendly spots",
                  color: "from-coral to-rose-500",
                },
                {
                  step: "02",
                  emoji: "🎛️",
                  title: "Filter Your Way",
                  description: "Changing tables, noise level, play areas - filter by what matters to your family",
                  color: "from-golden to-amber-500",
                },
                {
                  step: "03",
                  emoji: "🎉",
                  title: "Go Have Fun!",
                  description: "Read parent reviews, save favorites, and head out with confidence",
                  color: "from-mint to-emerald-500",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center group">
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5">
                      <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-100" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-200" />
                    </div>
                  )}

                  {/* Step card */}
                  <div className="relative">
                    {/* Number badge */}
                    <div className="absolute -top-3 -right-3 md:right-1/4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center z-20">
                      <span className={`text-sm font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.step}</span>
                    </div>

                    {/* Main circle */}
                    <div className={`relative w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}>
                      <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{item.emoji}</span>
                      </div>
                    </div>

                    <h3 className="font-bold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Carousel Style */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-lavender/20 to-peach relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-coral/20 blob-1 animate-float" />
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-golden/20 blob-2 animate-float-delay-1" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 text-sm font-semibold mb-6 shadow-sm">
              <Heart className="h-4 w-4 text-coral" />
              <span className="text-foreground/80">Loved by parents</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
              Parents are{" "}
              <span className="relative inline-block">
                <span className="relative z-10 underline-squiggle">raving</span>
              </span>
            </h2>
          </div>

          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                {/* Quote mark */}
                <div className="absolute -top-4 -left-2 text-8xl font-serif text-coral/10 leading-none">&ldquo;</div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-golden text-golden" />
                  ))}
                </div>

                <p className="text-foreground/80 mb-6 leading-relaxed relative z-10">
                  {testimonial.quote}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender to-peach flex items-center justify-center text-3xl shadow-md">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground/70">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Carousel */}
          <div className="md:hidden">
            <div className="relative bg-white rounded-3xl p-8 shadow-xl max-w-sm mx-auto">
              <div className="absolute -top-4 -left-2 text-8xl font-serif text-coral/10 leading-none">&ldquo;</div>

              <div className="flex gap-1 mb-4">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-golden text-golden" />
                ))}
              </div>

              <p className="text-foreground/80 mb-6 leading-relaxed relative z-10 min-h-[120px]">
                {testimonials[activeTestimonial].quote}
              </p>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender to-peach flex items-center justify-center text-3xl shadow-md">
                  {testimonials[activeTestimonial].avatar}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonials[activeTestimonial].author}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-coral w-8' : 'bg-coral/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA - Vibrant Card */}
      <section className="py-24 md:py-32 bg-peach relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-[2.5rem] overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-coral via-rose-500 to-orange-500" />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 deco-dots" style={{ backgroundImage: 'radial-gradient(white 2px, transparent 2px)' }} />
              </div>

              {/* Decorative shapes */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

              {/* Content */}
              <div className="relative z-10 p-10 md:p-16">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                  <div className="flex-1 text-center lg:text-left text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-semibold mb-6">
                      <Sparkles className="h-4 w-4" />
                      Premium Features
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      Go Premium,<br />Go Further
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-md">
                      Unlock personalized recommendations, offline access, and exclusive parent perks.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {premiumPerks.map((perk) => {
                        const Icon = perk.icon;
                        return (
                          <div key={perk.text} className="flex items-center gap-3 text-white/90">
                            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                              <Icon className="h-4 w-4" />
                            </div>
                            <span>{perk.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    {/* Pricing card */}
                    <div className="bg-white rounded-3xl p-8 shadow-2xl text-center min-w-[280px]">
                      <div className="text-sm font-semibold text-coral mb-2">PREMIUM</div>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-5xl font-black text-foreground">$9</span>
                        <span className="text-2xl font-bold text-foreground">.99</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">or $79.99/year (save 33%)</p>

                      <Link href="/auth/signup">
                        <Button className="w-full h-14 rounded-full bg-gradient-to-r from-coral to-rose-500 hover:from-coral/90 hover:to-rose-500/90 text-white font-bold text-lg shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:-translate-y-0.5">
                          Start Free Trial
                          <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                      </Link>

                      <p className="text-xs text-muted-foreground mt-4">7 days free, cancel anytime</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA - Simple and Bold */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-peach to-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-lavender/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-peach/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Animated rocket */}
            <div className="relative inline-block mb-8">
              <span className="text-7xl md:text-8xl inline-block animate-bounce-soft">🚀</span>
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-coral/20 rounded-full blur-md" />
            </div>

            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
              Ready for your next<br />
              <span className="text-gradient-sunset">family adventure?</span>
            </h2>

            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of parents exploring the world with their little ones. It&apos;s free to start.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button className="h-16 px-10 rounded-full bg-gradient-to-r from-coral to-rose-500 hover:from-coral/90 hover:to-rose-500/90 text-white font-bold text-lg shadow-xl shadow-coral/25 transition-all hover:shadow-2xl hover:-translate-y-1">
                  Get Started Free
                  <ChevronRight className="h-6 w-6 ml-1" />
                </Button>
              </Link>
              <Link href="/places">
                <Button variant="outline" className="h-16 px-10 rounded-full font-bold text-lg border-2 hover:bg-white/50 transition-all hover:-translate-y-1">
                  <MapPin className="h-5 w-5 mr-2" />
                  Browse Places
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-mint" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-mint" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-mint" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
