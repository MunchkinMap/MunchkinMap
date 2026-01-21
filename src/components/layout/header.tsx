"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  Button,
  Avatar,
  AvatarImage,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui";
import {
  Search,
  Menu,
  X,
  User,
  Settings,
  Heart,
  LogOut,
  LayoutDashboard,
  Building2,
  MapPin,
} from "lucide-react";

const navigation = [
  { name: "Explore", href: "/places", icon: MapPin },
  { name: "Resources", href: "/resources", icon: null },
  { name: "Deals", href: "/deals", icon: null },
  { name: "Community", href: "/community", icon: null },
];

export function Header() {
  const pathname = usePathname();
  const { user, profile, isLoading, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-cream/90 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative h-10 w-10 rounded-xl bg-gradient-terracotta flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all group-hover:scale-105">
              <span className="text-xl">👶</span>
            </div>
            <span className="font-display font-semibold text-xl hidden sm:block text-gradient-warm">
              MunchkinMap
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-semibold rounded-full transition-all",
                    isActive
                      ? "bg-terracotta/10 text-terracotta"
                      : "text-muted-foreground hover:bg-parchment hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <Link href="/search">
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex rounded-full hover:bg-parchment"
              >
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </Link>

            {/* Auth Section */}
            {isLoading ? (
              <div className="h-10 w-10 rounded-full bg-parchment animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full ring-2 ring-terracotta/20 hover:ring-terracotta/40 p-0"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={profile?.avatar_url || ""}
                        alt={profile?.full_name || ""}
                      />
                      <AvatarFallback className="bg-gradient-terracotta text-white font-semibold">
                        {getInitials(profile?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl p-2" align="end">
                  <div className="flex items-center gap-3 p-3 bg-parchment rounded-xl mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ""} />
                      <AvatarFallback className="bg-gradient-terracotta text-white font-semibold text-sm">
                        {getInitials(profile?.full_name || null)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold">{profile?.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link href="/profile/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  {profile?.role === "business" && (
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/business">
                        <Building2 className="mr-2 h-4 w-4" />
                        Business Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {profile?.role === "admin" && (
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link href="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="cursor-pointer text-destructive focus:text-destructive rounded-lg"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="rounded-full font-semibold hover:bg-parchment"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup" className="hidden sm:block">
                  <Button className="btn-primary text-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-parchment"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t animate-fade-up">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 font-semibold rounded-xl transition-colors",
                      isActive
                        ? "bg-terracotta/10 text-terracotta"
                        : "text-muted-foreground hover:bg-parchment hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 font-semibold rounded-xl text-muted-foreground hover:bg-parchment hover:text-foreground"
              >
                <Search className="h-5 w-5" />
                Search
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
