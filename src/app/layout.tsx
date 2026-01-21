import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MunchkinMap - Find Baby-Friendly Places Near You",
    template: "%s | MunchkinMap",
  },
  description:
    "Discover baby-friendly restaurants, cafes, and venues with changing stations, high chairs, and family amenities. The all-in-one parenting resource for new dads and families.",
  keywords: [
    "baby-friendly restaurants",
    "family-friendly places",
    "changing stations",
    "high chairs",
    "parenting resources",
    "new dad",
    "family outings",
    "kid-friendly venues",
  ],
  authors: [{ name: "MunchkinMap" }],
  creator: "MunchkinMap",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://munchkinmap.com",
    siteName: "MunchkinMap",
    title: "MunchkinMap - Find Baby-Friendly Places Near You",
    description:
      "Discover baby-friendly restaurants, cafes, and venues with changing stations, high chairs, and family amenities.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MunchkinMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MunchkinMap - Find Baby-Friendly Places Near You",
    description:
      "Discover baby-friendly restaurants, cafes, and venues with changing stations, high chairs, and family amenities.",
    images: ["/og-image.png"],
    creator: "@munchkinmap",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
