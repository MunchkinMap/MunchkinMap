-- ============================================
-- MUNCHKINMAP DATABASE SCHEMA
-- Initial migration for complete SaaS platform
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE user_role AS ENUM ('user', 'admin', 'business');
CREATE TYPE place_category AS ENUM ('restaurant', 'cafe', 'park', 'playground', 'museum', 'library', 'shopping', 'entertainment', 'healthcare', 'other');
CREATE TYPE price_range AS ENUM ('$', '$$', '$$$', '$$$$');
CREATE TYPE noise_level AS ENUM ('quiet', 'moderate', 'loud', 'unknown');
CREATE TYPE changing_station_location AS ENUM ('mens', 'womens', 'family', 'unisex');
CREATE TYPE changing_station_condition AS ENUM ('excellent', 'good', 'fair', 'poor', 'unknown');
CREATE TYPE stroller_type AS ENUM ('single', 'double', 'jogging', 'travel', 'umbrella', 'none');
CREATE TYPE contribution_type AS ENUM ('new_place', 'edit_place', 'add_photo', 'update_amenity', 'report_issue');
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE article_category AS ENUM ('feeding', 'sleep', 'development', 'health', 'activities', 'travel', 'gear', 'parenting_tips', 'dad_life', 'mom_life', 'relationships', 'mental_health');
CREATE TYPE resource_type AS ENUM ('article', 'video', 'tool', 'organization', 'app');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed', 'bogo', 'free_shipping', 'other');
CREATE TYPE deal_category AS ENUM ('baby_gear', 'clothing', 'food', 'toys', 'services', 'dining', 'activities', 'health', 'travel');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'trialing');
CREATE TYPE subscription_plan AS ENUM ('free', 'premium_monthly', 'premium_annual');
CREATE TYPE business_tier AS ENUM ('free', 'basic', 'premium', 'enterprise');
CREATE TYPE notification_type AS ENUM ('review_reply', 'contribution_approved', 'contribution_rejected', 'new_deal', 'thread_reply', 'mention', 'system');

-- ============================================
-- USERS & PROFILES
-- ============================================

-- Extended user profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'user',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Family profiles
CREATE TABLE public.family_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    family_name TEXT,
    num_children INTEGER DEFAULT 0,
    children JSONB DEFAULT '[]'::jsonb,
    stroller_type stroller_type,
    dietary_notes TEXT,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- PLACES & AMENITIES
-- ============================================

CREATE TABLE public.places (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category place_category NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT,
    country TEXT DEFAULT 'USA',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOGRAPHY(POINT, 4326),
    phone TEXT,
    website TEXT,
    hours JSONB,
    price_range price_range,

    -- Amenities stored as JSONB for flexibility
    amenities JSONB DEFAULT '{
        "changing_station": null,
        "high_chairs": false,
        "kids_menu": false,
        "stroller_friendly": false,
        "outdoor_seating": false,
        "play_area": false,
        "nursing_room": false,
        "family_restroom": false,
        "noise_level": "unknown",
        "wheelchair_accessible": false,
        "parking": null,
        "additional": []
    }'::jsonb,

    is_verified BOOLEAN DEFAULT FALSE,
    is_claimed BOOLEAN DEFAULT FALSE,
    claimed_by UUID REFERENCES public.profiles(id),

    average_rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    contribution_count INTEGER DEFAULT 0,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial index
CREATE INDEX places_location_idx ON public.places USING GIST (location);
CREATE INDEX places_category_idx ON public.places(category);
CREATE INDEX places_city_state_idx ON public.places(city, state);

-- Place images
CREATE TABLE public.place_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to update location geometry when lat/lng changes
CREATE OR REPLACE FUNCTION update_place_location()
RETURNS TRIGGER AS $$
BEGIN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_location_update
    BEFORE INSERT OR UPDATE OF latitude, longitude ON public.places
    FOR EACH ROW
    EXECUTE FUNCTION update_place_location();

-- ============================================
-- REVIEWS & CONTRIBUTIONS
-- ============================================

CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    visit_date DATE,
    with_children_ages INTEGER[],
    helpful_count INTEGER DEFAULT 0,
    amenity_ratings JSONB DEFAULT '{}'::jsonb,
    is_verified_visit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(place_id, user_id)
);

CREATE INDEX reviews_place_id_idx ON public.reviews(place_id);
CREATE INDEX reviews_user_id_idx ON public.reviews(user_id);

-- Review images
CREATE TABLE public.review_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Review helpful votes
CREATE TABLE public.review_helpful (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- User contributions
CREATE TABLE public.contributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type contribution_type NOT NULL,
    data JSONB NOT NULL,
    status contribution_status DEFAULT 'pending',
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to update place stats
CREATE OR REPLACE FUNCTION update_place_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE public.places
        SET
            average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE place_id = NEW.place_id),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE place_id = NEW.place_id),
            updated_at = NOW()
        WHERE id = NEW.place_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.places
        SET
            average_rating = (SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE place_id = OLD.place_id),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE place_id = OLD.place_id),
            updated_at = NOW()
        WHERE id = OLD.place_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_place_stats
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_place_review_stats();

-- ============================================
-- ARTICLES & RESOURCES
-- ============================================

CREATE TABLE public.articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    category article_category NOT NULL,
    tags TEXT[] DEFAULT '{}',
    target_ages JSONB DEFAULT '[]'::jsonb,
    read_time_minutes INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX articles_category_idx ON public.articles(category);
CREATE INDEX articles_published_idx ON public.articles(is_published, published_at);

CREATE TABLE public.resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    type resource_type NOT NULL,
    category article_category NOT NULL,
    is_trusted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DEALS & AFFILIATE
-- ============================================

CREATE TABLE public.deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    merchant_name TEXT NOT NULL,
    merchant_logo TEXT,
    discount_type discount_type NOT NULL,
    discount_value TEXT NOT NULL,
    original_price DECIMAL(10, 2),
    deal_price DECIMAL(10, 2),
    code TEXT,
    affiliate_url TEXT NOT NULL,
    affiliate_network TEXT,
    category deal_category NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_local BOOLEAN DEFAULT FALSE,
    location JSONB,
    starts_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    redemption_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX deals_category_idx ON public.deals(category);
CREATE INDEX deals_active_idx ON public.deals(starts_at, expires_at);

CREATE TABLE public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id),
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- COMMUNITY & FORUMS
-- ============================================

CREATE TABLE public.forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    thread_count INTEGER DEFAULT 0,
    post_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.forum_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMPTZ,
    last_reply_by UUID REFERENCES public.profiles(id),
    tags TEXT[] DEFAULT '{}',
    location JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

CREATE INDEX forum_threads_category_idx ON public.forum_threads(category_id);
CREATE INDEX forum_threads_author_idx ON public.forum_threads(author_id);

CREATE TABLE public.forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_solution BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.forum_post_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Local parent groups
CREATE TABLE public.local_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    cover_image TEXT,
    member_count INTEGER DEFAULT 0,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.local_group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID NOT NULL REFERENCES public.local_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

-- ============================================
-- BUSINESS & SUBSCRIPTIONS
-- ============================================

CREATE TABLE public.business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    subscription_tier business_tier DEFAULT 'free',
    subscription_status subscription_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(place_id)
);

CREATE TABLE public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    plan subscription_plan DEFAULT 'free',
    status subscription_status DEFAULT 'active',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ============================================
-- FAVORITES & NOTIFICATIONS
-- ============================================

CREATE TABLE public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    place_id UUID NOT NULL REFERENCES public.places(id) ON DELETE CASCADE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, place_id)
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX notifications_user_idx ON public.notifications(user_id, is_read);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.place_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_helpful ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Family profiles policies
CREATE POLICY "Users can view their own family profile"
    ON public.family_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own family profile"
    ON public.family_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own family profile"
    ON public.family_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Places policies
CREATE POLICY "Places are viewable by everyone"
    ON public.places FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create places"
    ON public.places FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins and business owners can update places"
    ON public.places FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        OR claimed_by = auth.uid()
    );

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone"
    ON public.reviews FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create reviews"
    ON public.reviews FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
    ON public.reviews FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
    ON public.reviews FOR DELETE
    USING (auth.uid() = user_id);

-- Articles policies
CREATE POLICY "Published articles are viewable by everyone"
    ON public.articles FOR SELECT
    USING (is_published = true OR author_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can manage articles"
    ON public.articles FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Deals policies
CREATE POLICY "Active deals are viewable by everyone"
    ON public.deals FOR SELECT
    USING (starts_at <= NOW() AND (expires_at IS NULL OR expires_at > NOW()));

CREATE POLICY "Admins can manage deals"
    ON public.deals FOR ALL
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Forum policies
CREATE POLICY "Forum categories are viewable by everyone"
    ON public.forum_categories FOR SELECT
    USING (true);

CREATE POLICY "Forum threads are viewable by everyone"
    ON public.forum_threads FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create threads"
    ON public.forum_threads FOR INSERT
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Forum posts are viewable by everyone"
    ON public.forum_posts FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create posts"
    ON public.forum_posts FOR INSERT
    WITH CHECK (auth.uid() = author_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
    ON public.favorites FOR ALL
    USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS FOR PROFILE CREATION
-- ============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_profiles_updated_at
    BEFORE UPDATE ON public.family_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON public.places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
    BEFORE UPDATE ON public.articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_threads_updated_at
    BEFORE UPDATE ON public.forum_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at
    BEFORE UPDATE ON public.forum_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
