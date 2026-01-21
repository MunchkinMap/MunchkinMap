"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui";
import {
  MapPin,
  Search,
  Star,
  ChevronRight,
  Shield,
  Heart,
  BookOpen,
  Tag,
  Users,
  ArrowRight,
  Check,
  Globe,
  Leaf,
  Coffee,
  TreePine,
  Building,
} from "lucide-react";

const categories = [
  { name: "Restaurants", emoji: "🍽️", href: "/places?category=restaurant", color: "bg-terracotta/10 hover:bg-terracotta/20 border-terracotta/20" },
  { name: "Cafes", emoji: "☕", href: "/places?category=cafe", color: "bg-honey/10 hover:bg-honey/20 border-honey/20" },
  { name: "Parks", emoji: "🌳", href: "/places?category=park", color: "bg-sage/10 hover:bg-sage/20 border-sage/20" },
  { name: "Playgrounds", emoji: "🎠", href: "/places?category=playground", color: "bg-plum/10 hover:bg-plum/20 border-plum/20" },
  { name: "Museums", emoji: "🏛️", href: "/places?category=museum", color: "bg-sky/10 hover:bg-sky/20 border-sky/20" },
  { name: "Shopping", emoji: "🛍️", href: "/places?category=shopping", color: "bg-terracotta-light/10 hover:bg-terracotta-light/20 border-terracotta-light/20" },
];

const features = [
  {
    icon: MapPin,
    title: "Dad-Approved Spots",
    description: "Find places with changing tables in the men's room. Because dads change diapers too!",
    color: "bg-terracotta",
  },
  {
    icon: Shield,
    title: "Verified by Parents",
    description: "Real reviews from real parents. No mystery, no surprises when you arrive.",
    color: "bg-sage",
  },
  {
    icon: BookOpen,
    title: "Resources & Guides",
    description: "From sleep tips to milestone tracking. Your parenting knowledge hub.",
    color: "bg-plum",
  },
  {
    icon: Tag,
    title: "Family Deals",
    description: "Exclusive discounts on gear, dining, and activities for your family.",
    color: "bg-honey",
  },
  {
    icon: Users,
    title: "Parent Squads",
    description: "Connect with local parents. Dad groups, playdates, and more.",
    color: "bg-sky",
  },
  {
    icon: Heart,
    title: "Personalized For You",
    description: "Recommendations based on your kids' ages and your family's preferences.",
    color: "bg-terracotta",
  },
];

const testimonials = [
  {
    quote: "Finally! An app that tells me if there's a changing table in the men's room. Total game changer for solo dad outings.",
    author: "Mike R.",
    role: "Dad of twins",
    location: "Austin, TX",
    rating: 5,
  },
  {
    quote: "We moved to a new city and MunchkinMap helped us find our new favorite family brunch spot within a week!",
    author: "Sarah K.",
    role: "Mom of 1",
    location: "Seattle, WA",
    rating: 5,
  },
  {
    quote: "The parent community is so supportive. Found a local dad group through here and we meet up every Saturday now.",
    author: "James T.",
    role: "First-time dad",
    location: "Denver, CO",
    rating: 5,
  },
];

const stats = [
  { value: "10K+", label: "Places Listed", icon: MapPin },
  { value: "50K+", label: "Happy Parents", icon: Users },
  { value: "100K+", label: "Reviews", icon: Star },
  { value: "200+", label: "Cities", icon: Globe },
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
    <div className="flex flex-col">
      {/* Hero Section - Warm & Inviting */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Soft gradient orbs */}
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-honey-light/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-sage-light/15 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-terracotta-light/10 rounded-full blur-3xl" />

          {/* Floating shapes */}
          <div className="absolute top-[15%] left-[10%] w-16 h-16 bg-honey/20 blob-1 animate-float-gentle" />
          <div className="absolute top-[25%] right-[15%] w-12 h-12 bg-sage/20 blob-2 animate-float-slow" />
          <div className="absolute bottom-[30%] left-[20%] w-20 h-20 bg-terracotta/10 blob-3 animate-float-gentle" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-[20%] right-[10%] w-14 h-14 bg-plum/15 blob-4 animate-float-slow" style={{ animationDelay: '1s' }} />

          {/* Subtle dot pattern */}
          <div className="absolute top-20 left-20 w-40 h-40 pattern-dots opacity-30" />
          <div className="absolute bottom-40 right-40 w-60 h-60 pattern-dots opacity-20" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Social proof badge */}
            <div className="flex justify-center mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-full px-5 py-2.5 shadow-soft border border-border">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-terracotta flex items-center justify-center text-white text-xs font-semibold ring-2 ring-card">M</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-sage flex items-center justify-center text-white text-xs font-semibold ring-2 ring-card">D</div>
                  <div className="w-7 h-7 rounded-full bg-gradient-honey flex items-center justify-center text-white text-xs font-semibold ring-2 ring-card">P</div>
                </div>
                <span className="text-sm font-medium text-muted-foreground">Join 50,000+ parents exploring together</span>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-semibold tracking-tight mb-6 leading-[1.1] animate-fade-up stagger-1">
              <span className="block">Family adventures</span>
              <span className="block text-gradient-warm underline-hand">start here</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-3 max-w-2xl mx-auto animate-fade-up stagger-2 leading-relaxed">
              Discover baby-friendly restaurants, parks, and hangouts.
            </p>
            <p className="text-base sm:text-lg font-medium text-foreground animate-fade-up stagger-2">
              Yes, even ones with changing tables in the men&apos;s room. 👨‍🍼
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mt-10 animate-fade-up stagger-3">
              <div className="search-refined p-2 flex items-center">
                <div className="flex-1 flex items-center">
                  <Search className="h-5 w-5 text-muted-foreground ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Try 'brunch with play area' or 'quiet cafe for naps'"
                    className="flex-1 h-12 px-4 bg-transparent text-base focus:outline-none placeholder:text-muted-foreground/60"
                  />
                </div>
                <Link href={`/places${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`}>
                  <Button className="btn-primary h-11 px-6 text-sm">
                    <MapPin className="h-4 w-4 mr-2" />
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
                    className="px-3 py-1.5 rounded-full bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground transition-all border border-border/50 hover:border-border"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10 animate-fade-up stagger-4">
              {categories.map((category) => (
                <Link key={category.name} href={category.href}>
                  <button className={`group flex items-center gap-2.5 px-5 py-3 rounded-full border transition-all hover:-translate-y-0.5 hover:shadow-soft ${category.color}`}>
                    <span className="text-xl group-hover:scale-110 transition-transform">{category.emoji}</span>
                    <span className="font-medium text-foreground/80 group-hover:text-foreground">{category.name}</span>
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
            <path
              d="M0 40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0V40Z"
              fill="hsl(var(--parchment))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-parchment py-12 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-card border border-border mb-3 group-hover:border-terracotta/30 group-hover:shadow-soft transition-all">
                    <Icon className="h-5 w-5 text-terracotta" />
                  </div>
                  <div className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-parchment via-cream to-cream relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-40 -left-20 w-60 h-60 bg-sage-light/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-honey-light/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="badge-soft badge-terracotta inline-flex mb-5">
              <Leaf className="h-4 w-4" />
              Everything you need
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-tight">
              More than just a{" "}
              <span className="highlight-soft">place finder</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your complete parenting sidekick for navigating the world with little ones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card-storybook p-7 group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-terracotta transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-cream relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <div className="badge-soft badge-sage inline-flex mb-5">
              <Coffee className="h-4 w-4" />
              How it works
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-semibold mb-4 tracking-tight">
              Three steps to your next{" "}
              <span className="text-gradient-nature">adventure</span>
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
                  color: "bg-terracotta",
                },
                {
                  step: "02",
                  emoji: "🎛️",
                  title: "Filter Your Way",
                  description: "Changing tables, noise level, play areas - filter by what matters to your family",
                  color: "bg-honey",
                },
                {
                  step: "03",
                  emoji: "🎉",
                  title: "Go Have Fun!",
                  description: "Read parent reviews, save favorites, and head out with confidence",
                  color: "bg-sage",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative text-center group">
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-border" />
                  )}

                  <div className="relative">
                    {/* Number badge */}
                    <div className="absolute -top-3 right-1/4 w-8 h-8 rounded-full bg-card border-2 border-border flex items-center justify-center z-20 shadow-soft">
                      <span className="text-xs font-semibold text-muted-foreground">{item.step}</span>
                    </div>

                    {/* Main circle */}
                    <div className={`relative w-28 h-28 mx-auto mb-6 rounded-full ${item.color} shadow-medium group-hover:scale-105 transition-all`}>
                      <div className="absolute inset-2 rounded-full bg-white/20 flex items-center justify-center">
                        <span className="text-4xl">{item.emoji}</span>
                      </div>
                    </div>

                    <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground max-w-xs mx-auto">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-parchment relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-terracotta/10 blob-1 animate-float-gentle" />
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-sage/10 blob-2 animate-float-slow" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="badge-soft badge-honey inline-flex mb-5">
              <Heart className="h-4 w-4" />
              Loved by parents
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-semibold tracking-tight">
              Parents are{" "}
              <span className="underline-hand">raving</span>
            </h2>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="flex gap-1 mb-4 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-honey text-honey" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-6 leading-relaxed relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-warm flex items-center justify-center text-white font-semibold text-sm">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role} · {testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="testimonial-card max-w-sm mx-auto">
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-honey text-honey" />
                ))}
              </div>
              <p className="text-foreground/80 mb-6 leading-relaxed relative z-10 min-h-[100px]">
                &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-warm flex items-center justify-center text-white font-semibold text-sm">
                  {testimonials[activeTestimonial].author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-sm">{testimonials[activeTestimonial].author}</p>
                  <p className="text-xs text-muted-foreground">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeTestimonial ? 'bg-terracotta w-6' : 'bg-terracotta/30 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="card-illustrated overflow-hidden">
              <div className="bg-gradient-terracotta p-10 md:p-14">
                <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
                  <div className="flex-1 text-center lg:text-left text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm font-medium mb-6">
                      <Star className="h-4 w-4" />
                      Premium Features
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-semibold mb-4 leading-tight">
                      Go Premium,<br />Go Further
                    </h2>
                    <p className="text-white/90 text-lg mb-8 max-w-md">
                      Unlock personalized recommendations, offline access, and exclusive parent perks.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Personalized family feed",
                        "Save unlimited favorites",
                        "Offline access",
                        "Ad-free experience",
                      ].map((perk) => (
                        <div key={perk} className="flex items-center gap-2 text-white/90">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="bg-card rounded-3xl p-8 shadow-elevated text-center min-w-[280px]">
                      <div className="text-sm font-semibold text-terracotta mb-2">PREMIUM</div>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-4xl font-display font-semibold text-foreground">$9</span>
                        <span className="text-xl font-semibold text-foreground">.99</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-6">or $79.99/year (save 33%)</p>
                      <Link href="/auth/signup">
                        <Button className="btn-primary w-full h-12 text-base">
                          Start Free Trial
                          <ArrowRight className="h-4 w-4 ml-2" />
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

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-cream to-parchment relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-sage-light/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-honey-light/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="relative inline-block mb-8">
              <span className="text-6xl md:text-7xl inline-block animate-float-gentle">🚀</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-display font-semibold mb-6 tracking-tight leading-tight">
              Ready for your next<br />
              <span className="text-gradient-warm">family adventure?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of parents exploring the world with their little ones. It&apos;s free to start.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button className="btn-primary h-14 px-8 text-base">
                  Get Started Free
                  <ChevronRight className="h-5 w-5 ml-1" />
                </Button>
              </Link>
              <Link href="/places">
                <Button className="btn-secondary h-14 px-8 text-base">
                  <MapPin className="h-5 w-5 mr-2" />
                  Browse Places
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sage" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sage" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-sage" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
