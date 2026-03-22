"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS, SLOVAK_CITIES } from "@/lib/constants";
import type { PropertyType, TransactionType } from "@/lib/types";

export function HeroSearch() {
  const router = useRouter();
  const [transaction, setTransaction] = useState<TransactionType>("sale");
  const [type, setType] = useState<PropertyType | "">("");
  const [city, setCity] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("transaction", transaction);
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    router.push(`/nehnutelnosti?${params.toString()}`);
  };

  return (
    <section
      className="relative bg-gradient-to-br from-brand-subtle via-white to-bg-subtle"
      aria-label="Vyhľadávanie nehnuteľností"
    >
      <div className="container py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-text tracking-tight mb-4 animate-fade-up">
            Nájdite svoj vysnívaný{" "}
            <span className="text-brand">domov</span>
          </h1>
          <p className="text-lg text-text-secondary animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Moderný spôsob hľadania nehnuteľností na Slovensku.
            Transparentne, rýchlo a jednoducho.
          </p>
        </div>

        {/* Search form */}
        <div
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-border p-6 animate-fade-up"
          style={{ animationDelay: "0.2s" }}
        >
          {/* Transaction toggle */}
          <div className="flex gap-2 mb-5">
            {(Object.entries(TRANSACTION_LABELS) as [TransactionType, string][]).map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() => setTransaction(value)}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    transaction === value
                      ? "bg-brand text-white shadow-sm"
                      : "bg-bg-subtle text-text-secondary hover:bg-bg-muted"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Type */}
            <select
              value={type}
              onChange={(e) => setType(e.target.value as PropertyType | "")}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
              aria-label="Typ nehnuteľnosti"
            >
              <option value="">Všetky typy</option>
              {(
                Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]
              ).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>

            {/* City */}
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
              aria-label="Mesto"
            >
              <option value="">Celé Slovensko</option>
              {SLOVAK_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Search button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleSearch}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Hľadať
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
