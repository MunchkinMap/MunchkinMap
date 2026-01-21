// ============================================
// USER & AUTHENTICATION TYPES
// ============================================

export type UserRole = "user" | "admin" | "business";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface FamilyProfile {
  id: string;
  user_id: string;
  family_name: string | null;
  num_children: number;
  children: Child[];
  stroller_type: StrollerType | null;
  dietary_notes: string | null;
  preferences: FamilyPreferences;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  allergies: string[];
}

export type StrollerType = "single" | "double" | "jogging" | "travel" | "umbrella" | "none";

export interface FamilyPreferences {
  noise_tolerance: "quiet" | "moderate" | "loud";
  preferred_amenities: AmenityType[];
  preferred_price_range: PriceRange[];
  accessibility_needs: string[];
}

// ============================================
// PLACES & AMENITIES TYPES
// ============================================

export interface Place {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: PlaceCategory;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  hours: BusinessHours | null;
  price_range: PriceRange;
  amenities: PlaceAmenities;
  images: PlaceImage[];
  is_verified: boolean;
  is_claimed: boolean;
  claimed_by: string | null;
  average_rating: number;
  review_count: number;
  contribution_count: number;
  created_at: string;
  updated_at: string;
}

export type PlaceCategory =
  | "restaurant"
  | "cafe"
  | "park"
  | "playground"
  | "museum"
  | "library"
  | "shopping"
  | "entertainment"
  | "healthcare"
  | "other";

export type PriceRange = "$" | "$$" | "$$$" | "$$$$";

export interface BusinessHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface DayHours {
  open: string;
  close: string;
  is_closed: boolean;
}

export interface PlaceAmenities {
  changing_station: ChangingStationInfo | null;
  high_chairs: boolean;
  kids_menu: boolean;
  stroller_friendly: boolean;
  outdoor_seating: boolean;
  play_area: boolean;
  nursing_room: boolean;
  family_restroom: boolean;
  noise_level: NoiseLevel;
  wheelchair_accessible: boolean;
  parking: ParkingInfo | null;
  additional: string[];
}

export interface ChangingStationInfo {
  available: boolean;
  locations: ChangingStationLocation[];
  condition: "excellent" | "good" | "fair" | "poor" | "unknown";
  last_verified: string | null;
}

export type ChangingStationLocation = "mens" | "womens" | "family" | "unisex";

export type NoiseLevel = "quiet" | "moderate" | "loud" | "unknown";

export interface ParkingInfo {
  available: boolean;
  type: ("street" | "lot" | "garage" | "valet")[];
  stroller_accessible: boolean;
}

export interface PlaceImage {
  id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  uploaded_by: string;
  created_at: string;
}

export type AmenityType =
  | "changing_station"
  | "high_chairs"
  | "kids_menu"
  | "stroller_friendly"
  | "outdoor_seating"
  | "play_area"
  | "nursing_room"
  | "family_restroom"
  | "wheelchair_accessible"
  | "quiet"
  | "parking";

// ============================================
// REVIEWS & CONTRIBUTIONS
// ============================================

export interface Review {
  id: string;
  place_id: string;
  user_id: string;
  user: Pick<User, "id" | "full_name" | "avatar_url">;
  rating: number;
  title: string | null;
  content: string;
  visit_date: string | null;
  with_children_ages: number[];
  helpful_count: number;
  images: ReviewImage[];
  amenity_ratings: AmenityRatings;
  is_verified_visit: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewImage {
  id: string;
  url: string;
  caption: string | null;
}

export interface AmenityRatings {
  cleanliness: number | null;
  kid_friendliness: number | null;
  staff_helpfulness: number | null;
  changing_station_quality: number | null;
  stroller_accessibility: number | null;
  noise_accuracy: number | null;
}

export interface Contribution {
  id: string;
  place_id: string;
  user_id: string;
  type: ContributionType;
  data: Record<string, unknown>;
  status: ContributionStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export type ContributionType =
  | "new_place"
  | "edit_place"
  | "add_photo"
  | "update_amenity"
  | "report_issue";

export type ContributionStatus = "pending" | "approved" | "rejected";

// ============================================
// RESOURCES & ARTICLES
// ============================================

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author_id: string;
  author: Pick<User, "id" | "full_name" | "avatar_url">;
  category: ArticleCategory;
  tags: string[];
  target_ages: AgeRange[];
  read_time_minutes: number;
  is_featured: boolean;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type ArticleCategory =
  | "feeding"
  | "sleep"
  | "development"
  | "health"
  | "activities"
  | "travel"
  | "gear"
  | "parenting_tips"
  | "dad_life"
  | "mom_life"
  | "relationships"
  | "mental_health";

export interface AgeRange {
  min_months: number;
  max_months: number | null;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  category: ArticleCategory;
  is_trusted: boolean;
  created_at: string;
}

export type ResourceType = "article" | "video" | "tool" | "organization" | "app";

// ============================================
// DEALS & AFFILIATE
// ============================================

export interface Deal {
  id: string;
  title: string;
  slug: string;
  description: string;
  merchant_name: string;
  merchant_logo: string | null;
  discount_type: DiscountType;
  discount_value: string;
  original_price: number | null;
  deal_price: number | null;
  code: string | null;
  affiliate_url: string;
  affiliate_network: string | null;
  category: DealCategory;
  is_featured: boolean;
  is_local: boolean;
  location: { city: string; state: string } | null;
  starts_at: string;
  expires_at: string | null;
  redemption_count: number;
  created_at: string;
}

export type DiscountType = "percentage" | "fixed" | "bogo" | "free_shipping" | "other";

export type DealCategory =
  | "baby_gear"
  | "clothing"
  | "food"
  | "toys"
  | "services"
  | "dining"
  | "activities"
  | "health"
  | "travel";

export interface AffiliateClick {
  id: string;
  deal_id: string;
  user_id: string | null;
  ip_hash: string;
  user_agent: string;
  referrer: string | null;
  created_at: string;
}

// ============================================
// COMMUNITY & FORUMS
// ============================================

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  thread_count: number;
  post_count: number;
  sort_order: number;
}

export interface ForumThread {
  id: string;
  category_id: string;
  author_id: string;
  author: Pick<User, "id" | "full_name" | "avatar_url">;
  title: string;
  slug: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at: string | null;
  last_reply_by: Pick<User, "id" | "full_name"> | null;
  tags: string[];
  location: { city: string; state: string } | null;
  created_at: string;
  updated_at: string;
}

export interface ForumPost {
  id: string;
  thread_id: string;
  author_id: string;
  author: Pick<User, "id" | "full_name" | "avatar_url">;
  content: string;
  is_solution: boolean;
  like_count: number;
  created_at: string;
  updated_at: string;
}

export interface LocalGroup {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  state: string;
  cover_image: string | null;
  member_count: number;
  is_private: boolean;
  created_by: string;
  created_at: string;
}

// ============================================
// BUSINESS & SUBSCRIPTIONS
// ============================================

export interface BusinessProfile {
  id: string;
  user_id: string;
  place_id: string;
  business_name: string;
  contact_email: string;
  contact_phone: string | null;
  is_verified: boolean;
  subscription_tier: BusinessTier;
  subscription_status: SubscriptionStatus;
  created_at: string;
}

export type BusinessTier = "free" | "basic" | "premium" | "enterprise";

export type SubscriptionStatus = "active" | "past_due" | "canceled" | "trialing";

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export type SubscriptionPlan = "free" | "premium_monthly" | "premium_annual";

// ============================================
// SEARCH & FILTERS
// ============================================

export interface SearchFilters {
  query?: string;
  category?: PlaceCategory[];
  amenities?: AmenityType[];
  changing_station_location?: ChangingStationLocation[];
  price_range?: PriceRange[];
  noise_level?: NoiseLevel[];
  min_rating?: number;
  distance?: number;
  is_verified?: boolean;
  has_photos?: boolean;
  sort_by?: SortOption;
}

export type SortOption =
  | "relevance"
  | "distance"
  | "rating"
  | "reviews"
  | "newest"
  | "alphabetical";

export interface SearchResult {
  places: Place[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ============================================
// NOTIFICATIONS & FAVORITES
// ============================================

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export type NotificationType =
  | "review_reply"
  | "contribution_approved"
  | "contribution_rejected"
  | "new_deal"
  | "thread_reply"
  | "mention"
  | "system";

export interface Favorite {
  id: string;
  user_id: string;
  place_id: string;
  place: Pick<Place, "id" | "name" | "slug" | "category" | "address" | "city" | "average_rating" | "images">;
  note: string | null;
  created_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
