"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS, SLOVAK_CITIES } from "@/lib/constants";
import type { PropertyType, TransactionType } from "@/lib/types";

export default function NewPropertyPage() {
  const router = useRouter();
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    type: "apartment" as PropertyType,
    transaction: "sale" as TransactionType,
    rooms: "",
    area: "",
    city: "",
    district: "",
    address: "",
  });

  const handleImport = async () => {
    if (!importUrl) return;
    setImporting(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({
          ...prev,
          title: data.title || prev.title,
          description: data.description || prev.description,
          price: data.price?.toString() || prev.price,
          area: data.area?.toString() || prev.area,
          rooms: data.rooms?.toString() || prev.rooms,
        }));
      }
    } catch {
      // Import failed silently
    } finally {
      setImporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to Supabase
    router.push("/dashboard");
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-text mb-6">Nový inzerát</h1>

      {/* Smart Import */}
      <Card className="mb-6">
        <CardContent>
          <h2 className="text-lg font-semibold text-text mb-3">
            Smart Import
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Zadajte URL z nehnutelnosti.sk a automaticky vyplníme formulár.
          </p>
          <div className="flex gap-3">
            <Input
              placeholder="https://www.nehnutelnosti.sk/..."
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleImport}
              loading={importing}
              variant="secondary"
            >
              Importovať
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Property form */}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic info */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Základné informácie
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    id="title"
                    label="Názov inzerátu"
                    placeholder="Napr. Krásny 3-izbový byt v centre"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Typ nehnuteľnosti
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value as PropertyType,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
                  >
                    {(
                      Object.entries(PROPERTY_TYPE_LABELS) as [
                        PropertyType,
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Transakcia
                  </label>
                  <select
                    value={form.transaction}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        transaction: e.target.value as TransactionType,
                      })
                    }
                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
                  >
                    {(
                      Object.entries(TRANSACTION_LABELS) as [
                        TransactionType,
                        string,
                      ][]
                    ).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  id="price"
                  type="number"
                  label="Cena (EUR)"
                  placeholder="200000"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />

                <Input
                  id="area"
                  type="number"
                  label="Plocha (m²)"
                  placeholder="75"
                  value={form.area}
                  onChange={(e) =>
                    setForm({ ...form, area: e.target.value })
                  }
                  required
                />

                <Input
                  id="rooms"
                  type="number"
                  label="Počet izieb"
                  placeholder="3"
                  value={form.rooms}
                  onChange={(e) =>
                    setForm({ ...form, rooms: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">
                Lokalita
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Mesto
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Vyberte mesto</option>
                    {SLOVAK_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  id="district"
                  label="Mestská časť"
                  placeholder="Napr. Ružinov"
                  value={form.district}
                  onChange={(e) =>
                    setForm({ ...form, district: e.target.value })
                  }
                />

                <div className="sm:col-span-2">
                  <Input
                    id="address"
                    label="Adresa"
                    placeholder="Ulica a číslo"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-text mb-4">Popis</h2>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Popis nehnuteľnosti
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={6}
                className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-faint transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 resize-y"
                placeholder="Podrobný popis nehnuteľnosti..."
                required
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/dashboard")}
              >
                Zrušiť
              </Button>
              <Button type="submit">Publikovať inzerát</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
