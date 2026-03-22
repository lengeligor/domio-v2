// Database row types (snake_case matching Supabase)
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  company: string | null;
  role: "seeker" | "agent" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  price_per_m2: number | null;
  type: PropertyType;
  transaction: TransactionType;
  rooms: number;
  area: number;
  floor: number | null;
  total_floors: number | null;
  city: string;
  district: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  features: string[];
  energy_class: string | null;
  year_built: number | null;
  agent_id: string;
  status: "draft" | "active" | "archived";
  views: number;
  is_featured: boolean;
  source_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  storage_path: string;
  url: string;
  position: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
}

export interface Watchdog {
  id: string;
  user_id: string;
  name: string;
  filters: SearchFilters;
  is_active: boolean;
  last_notified_at: string | null;
  created_at: string;
}

export interface PriceHistory {
  id: string;
  property_id: string;
  price: number;
  recorded_at: string;
}

// Enums
export type PropertyType = "apartment" | "house" | "land" | "commercial";
export type TransactionType = "sale" | "rent";

// Search & Filter
export interface SearchFilters {
  query?: string;
  type?: PropertyType;
  transaction?: TransactionType;
  priceMin?: number;
  priceMax?: number;
  roomsMin?: number;
  roomsMax?: number;
  areaMin?: number;
  areaMax?: number;
  city?: string;
  district?: string;
}

// Joined types for UI
export interface PropertyWithImages extends Property {
  images: PropertyImage[];
}

export interface PropertyWithAgent extends Property {
  agent: Pick<Profile, "id" | "full_name" | "avatar_url" | "phone" | "company">;
  images: PropertyImage[];
}

export interface PropertyCard {
  id: string;
  slug: string;
  title: string;
  price: number;
  type: PropertyType;
  transaction: TransactionType;
  rooms: number;
  area: number;
  city: string;
  district: string | null;
  image_url: string | null;
  is_featured: boolean;
}
