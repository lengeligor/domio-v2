import type { PropertyCard } from "./types";

// Mock data for development before Supabase is connected
export const MOCK_PROPERTIES: PropertyCard[] = [
  {
    id: "1",
    slug: "bratislava-stare-mesto-luxusny-3-izbovy-byt-1",
    title: "Luxusný 3-izbový byt v centre Starého Mesta",
    price: 285000,
    type: "apartment",
    transaction: "sale",
    rooms: 3,
    area: 95,
    city: "Bratislava",
    district: "Staré Mesto",
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    is_featured: true,
  },
  {
    id: "2",
    slug: "bratislava-ruzinov-moderny-2-izbovy-byt-2",
    title: "Moderný 2-izbový byt v novostavbe Ružinov",
    price: 195000,
    type: "apartment",
    transaction: "sale",
    rooms: 2,
    area: 58,
    city: "Bratislava",
    district: "Ružinov",
    image_url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    is_featured: true,
  },
  {
    id: "3",
    slug: "kosice-4-izbovy-byt-3",
    title: "Priestranný 4-izbový byt s balkónom",
    price: 175000,
    type: "apartment",
    transaction: "sale",
    rooms: 4,
    area: 110,
    city: "Košice",
    district: null,
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop",
    is_featured: false,
  },
  {
    id: "4",
    slug: "bratislava-rodinny-dom-zahrada-4",
    title: "Rodinný dom s krásnou záhradou",
    price: 450000,
    type: "house",
    transaction: "sale",
    rooms: 6,
    area: 220,
    city: "Bratislava",
    district: "Karlova Ves",
    image_url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
    is_featured: true,
  },
  {
    id: "5",
    slug: "zilina-1-izbovy-prenajom-5",
    title: "Útulný 1-izbový byt na prenájom",
    price: 550,
    type: "apartment",
    transaction: "rent",
    rooms: 1,
    area: 35,
    city: "Žilina",
    district: null,
    image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop",
    is_featured: false,
  },
  {
    id: "6",
    slug: "bratislava-pozemok-6",
    title: "Stavebný pozemok v tichej lokalite",
    price: 120000,
    type: "land",
    transaction: "sale",
    rooms: 0,
    area: 650,
    city: "Bratislava",
    district: "Záhorská Bystrica",
    image_url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    is_featured: false,
  },
];

export function getMockFeaturedProperties(): PropertyCard[] {
  return MOCK_PROPERTIES.filter((p) => p.is_featured);
}

export function getMockProperties(filters?: {
  type?: string;
  transaction?: string;
  city?: string;
}): PropertyCard[] {
  let results = [...MOCK_PROPERTIES];
  if (filters?.type) results = results.filter((p) => p.type === filters.type);
  if (filters?.transaction)
    results = results.filter((p) => p.transaction === filters.transaction);
  if (filters?.city) results = results.filter((p) => p.city === filters.city);
  return results;
}
