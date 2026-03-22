import Link from "next/link";
import { HeroSearch } from "@/components/search/HeroSearch";
import { PropertyCard } from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/Button";
import { getMockFeaturedProperties } from "@/lib/mock-data";

export default function HomePage() {
  // TODO: Replace with Supabase query when connected
  const featuredProperties = getMockFeaturedProperties();

  return (
    <>
      {/* Hero Search */}
      <HeroSearch />

      {/* Featured Properties */}
      <section className="container py-16" aria-labelledby="featured-heading">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              id="featured-heading"
              className="text-2xl font-bold text-text"
            >
              Odporúčané nehnuteľnosti
            </h2>
            <p className="text-text-muted mt-1">
              Najlepšie ponuky vybrané pre vás
            </p>
          </div>
          <Link href="/nehnutelnosti">
            <Button variant="secondary" size="sm">
              Zobraziť všetky
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </section>

      {/* Why Domio */}
      <section className="bg-bg-subtle py-16" aria-labelledby="why-heading">
        <div className="container">
          <h2
            id="why-heading"
            className="text-2xl font-bold text-text text-center mb-10"
          >
            Prečo Domio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                ),
                title: "Inteligentné vyhľadávanie",
                description:
                  "Pokročilé filtre, mapa a strážne psy vám pomôžu nájsť presne to, čo hľadáte.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: "Transparentnosť",
                description:
                  "História cien, overení makléri a detailné informácie o každej nehnuteľnosti.",
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                ),
                title: "Bleskovo rýchle",
                description:
                  "Moderná technológia pre okamžité načítanie a plynulý zážitok na každom zariadení.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-white border border-border"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-subtle text-brand flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA for Agents */}
      <section className="container py-16" aria-labelledby="cta-heading">
        <div className="bg-gradient-to-r from-brand to-brand-light rounded-2xl p-10 text-center text-white">
          <h2 id="cta-heading" className="text-2xl md:text-3xl font-bold mb-3">
            Ste realitný makléř?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Pridajte svoje nehnuteľnosti na Domio a oslovte tisíce potenciálnych
            kupujúcich. Smart Import vám ušetrí hodiny práce.
          </p>
          <Link href="/registracia">
            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-brand hover:bg-white/90 border-0"
            >
              Začať zadarmo
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
