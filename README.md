# MunchkinMap

A parent-centric SaaS platform that helps new parents find baby-friendly places and provides holistic parenting resources. Built with Next.js, Supabase, Mapbox, and Stripe.

## Features

### Core Features
- **Place Discovery** - Find baby-friendly restaurants, cafes, parks, and venues
- **Detailed Amenity Filters** - Filter by changing stations (including location in men's/women's/family rooms), high chairs, stroller access, noise level, and more
- **Interactive Maps** - Mapbox-powered map with place markers and geolocation
- **User Reviews** - Structured reviews with amenity ratings from real parents
- **User Contributions** - Community-driven place additions and updates

### Parent Resources
- **Article Hub** - Expert parenting articles on sleep, feeding, milestones, and more
- **Dad Life Content** - Content specifically geared toward new dads
- **Resource Directory** - Curated links to trusted parenting resources

### Community
- **Forums** - Topic-based discussion threads
- **Local Groups** - Connect with parents in your area
- **Q&A** - Get answers to parenting questions

### Deals & Savings
- **Curated Deals** - Baby gear, dining, activities, and services
- **Affiliate Tracking** - Built-in affiliate link management
- **Local Deals** - Location-specific offers

### Premium Features
- Personalized recommendations
- Saved searches
- Offline access to favorites
- Advanced filters
- Ad-free experience

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Maps**: Mapbox GL JS
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Mapbox account
- Stripe account (for payments)

### 1. Clone and Install

```bash
cd munchkinmap
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings > API** and copy your project URL and anon key
3. Go to **SQL Editor** and run the migration file:
   - Open `supabase/migrations/00001_initial_schema.sql`
   - Copy the contents and run in the SQL Editor

**Note**: The schema requires the PostGIS extension. Enable it in **Database > Extensions**.

### 3. Set Up Mapbox

1. Create an account at [mapbox.com](https://www.mapbox.com)
2. Go to **Account > Tokens**
3. Copy your default public token or create a new one

### 4. Set Up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Go to **Developers > API keys** and copy your keys
3. Create products and prices:
   - Create a product called "MunchkinMap Premium"
   - Add two prices:
     - Monthly: $9.99/month
     - Annual: $95.88/year ($7.99/month)
   - Copy the price IDs

4. Set up webhook:
   - Go to **Developers > Webhooks**
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copy the webhook signing secret

### 5. Configure Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.your-mapbox-token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_...
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=MunchkinMap
```

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
munchkinmap/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication pages
│   │   ├── places/            # Place discovery pages
│   │   ├── resources/         # Article/resource pages
│   │   ├── deals/             # Deals pages
│   │   ├── community/         # Forum/community pages
│   │   ├── profile/           # User profile pages
│   │   ├── admin/             # Admin dashboard
│   │   └── business/          # Business dashboard
│   ├── components/
│   │   ├── ui/                # Base UI components
│   │   ├── layout/            # Header, Footer, etc.
│   │   ├── places/            # Place-related components
│   │   ├── maps/              # Map components
│   │   ├── auth/              # Auth components
│   │   ├── reviews/           # Review components
│   │   └── ...
│   ├── lib/
│   │   ├── supabase/          # Supabase client config
│   │   ├── stripe/            # Stripe utilities
│   │   ├── mapbox/            # Mapbox utilities
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── validations/       # Zod schemas
│   └── types/                 # TypeScript types
├── supabase/
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── ...config files
```

## Database Schema

The database includes tables for:

- **Users & Profiles** - Extended user data and family profiles
- **Places** - Venues with amenities, hours, and geospatial data
- **Reviews** - Structured reviews with amenity ratings
- **Articles & Resources** - Parenting content
- **Deals** - Affiliate deals and tracking
- **Community** - Forums, threads, posts, and groups
- **Subscriptions** - User and business subscriptions

See `supabase/migrations/00001_initial_schema.sql` for the complete schema.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

## Authentication

Supported auth methods:
- Email/password
- Google OAuth
- GitHub OAuth

Configure OAuth providers in your Supabase dashboard under **Authentication > Providers**.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For issues and feature requests, please open a GitHub issue.

---

Built with care for parents everywhere.
