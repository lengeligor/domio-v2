import type { PropertyType, TransactionType } from "./types";

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: "Byt",
  house: "Dom",
  land: "Pozemok",
  commercial: "Komerčný priestor",
};

export const TRANSACTION_LABELS: Record<TransactionType, string> = {
  sale: "Predaj",
  rent: "Prenájom",
};

export const ENERGY_CLASSES = ["A0", "A1", "A", "B", "C", "D", "E", "F", "G"] as const;

export const SLOVAK_CITIES = [
  "Bratislava",
  "Košice",
  "Prešov",
  "Žilina",
  "Banská Bystrica",
  "Nitra",
  "Trnava",
  "Trenčín",
  "Martin",
  "Poprad",
  "Piešťany",
  "Zvolen",
  "Považská Bystrica",
  "Michalovce",
  "Nové Zámky",
  "Spišská Nová Ves",
  "Komárno",
  "Levice",
  "Humenné",
  "Bardejov",
] as const;

export const BRATISLAVA_DISTRICTS = [
  "Staré Mesto",
  "Ružinov",
  "Nové Mesto",
  "Petržalka",
  "Karlova Ves",
  "Dúbravka",
  "Lamač",
  "Devín",
  "Devínska Nová Ves",
  "Záhorská Bystrica",
  "Vajnory",
  "Rača",
  "Podunajské Biskupice",
  "Vrakuňa",
  "Čunovo",
  "Rusovce",
  "Jarovce",
] as const;

export const SITE_NAME = "Domio";
export const SITE_DESCRIPTION = "Moderný portál nehnuteľností na Slovensku. Nájdite svoj vysnívaný domov s Domio.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://domio.sk";
