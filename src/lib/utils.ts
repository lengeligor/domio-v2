import slugifyLib from "slugify";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  return `${new Intl.NumberFormat("sk-SK").format(area)} m²`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("sk-SK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Dnes";
  if (diffDays === 1) return "Včera";
  if (diffDays < 7) return `Pred ${diffDays} dňami`;
  if (diffDays < 30) return `Pred ${Math.floor(diffDays / 7)} týždňami`;
  return formatDate(date);
}

export function generateSlug(title: string, city: string, id?: string): string {
  const base = slugifyLib(`${city} ${title}`, {
    lower: true,
    strict: true,
    locale: "sk",
  });
  return id ? `${base}-${id.slice(0, 8)}` : base;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function getRoomsLabel(rooms: number): string {
  if (rooms === 1) return "1-izbový";
  if (rooms >= 2 && rooms <= 4) return `${rooms}-izbový`;
  return `${rooms}-izbový`;
}
