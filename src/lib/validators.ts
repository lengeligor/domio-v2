import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Zadajte platný email"),
  password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
  email: z.string().email("Zadajte platný email"),
  password: z.string().min(6, "Heslo musí mať aspoň 6 znakov"),
  role: z.enum(["seeker", "agent"]),
});

export const propertySchema = z.object({
  title: z.string().min(5, "Názov musí mať aspoň 5 znakov"),
  description: z.string().min(20, "Popis musí mať aspoň 20 znakov"),
  price: z.number().positive("Cena musí byť kladná"),
  type: z.enum(["apartment", "house", "land", "commercial"]),
  transaction: z.enum(["sale", "rent"]),
  rooms: z.number().int().min(0),
  area: z.number().positive("Plocha musí byť kladná"),
  floor: z.number().int().nullable().optional(),
  total_floors: z.number().int().nullable().optional(),
  city: z.string().min(1, "Vyberte mesto"),
  district: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  features: z.array(z.string()).default([]),
  energy_class: z.string().nullable().optional(),
  year_built: z.number().int().nullable().optional(),
});

export const watchdogSchema = z.object({
  name: z.string().min(1, "Zadajte názov strážneho psa"),
  filters: z.object({
    type: z.enum(["apartment", "house", "land", "commercial"]).optional(),
    transaction: z.enum(["sale", "rent"]).optional(),
    priceMin: z.number().optional(),
    priceMax: z.number().optional(),
    roomsMin: z.number().optional(),
    roomsMax: z.number().optional(),
    areaMin: z.number().optional(),
    areaMax: z.number().optional(),
    city: z.string().optional(),
    district: z.string().optional(),
  }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type WatchdogInput = z.infer<typeof watchdogSchema>;
