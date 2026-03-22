"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property/PropertyCard";
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS, SLOVAK_CITIES } from "@/lib/constants";
import { getMockProperties } from "@/lib/mock-data";
import type { PropertyType, TransactionType } from "@/lib/types";

interface SearchClientProps {
  initialParams: Record<string, string>;
}

export function SearchClient({ initialParams }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState(searchParams.get("type") || "");
  const [transaction, setTransaction] = useState(searchParams.get("transaction") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");

  // TODO: Replace with Supabase query
  const properties = useMemo(() => {
    return getMockProperties({
      type: type || undefined,
      transaction: transaction || undefined,
      city: city || undefined,
    });
  }, [type, transaction, city]);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/nehnutelnosti?${params.toString()}`, { scroll: false });
  };

  return (
    <div>
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={transaction}
            onChange={(e) => {
              setTransaction(e.target.value);
              updateFilters("transaction", e.target.value);
            }}
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
            aria-label="Typ transakcie"
          >
            <option value="">Predaj aj prenájom</option>
            {(Object.entries(TRANSACTION_LABELS) as [TransactionType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              updateFilters("type", e.target.value);
            }}
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
            aria-label="Typ nehnuteľnosti"
          >
            <option value="">Všetky typy</option>
            {(Object.entries(PROPERTY_TYPE_LABELS) as [PropertyType, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>

          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              updateFilters("city", e.target.value);
            }}
            className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
            aria-label="Mesto"
          >
            <option value="">Celé Slovensko</option>
            {SLOVAK_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">
          {properties.length}{" "}
          {properties.length === 1
            ? "nehnuteľnosť"
            : properties.length >= 2 && properties.length <= 4
              ? "nehnuteľnosti"
              : "nehnuteľností"}
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-bg-muted flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-faint">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-text mb-1">
            Žiadne výsledky
          </h3>
          <p className="text-text-muted text-sm">
            Skúste zmeniť filtre pre zobrazenie viacerých výsledkov.
          </p>
        </div>
      )}
    </div>
  );
}
