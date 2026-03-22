import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, formatArea, getRoomsLabel, formatDate } from "@/lib/utils";
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS, SITE_NAME, SITE_URL } from "@/lib/constants";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

// TODO: Replace with Supabase query
function getPropertyBySlug(slug: string) {
  return MOCK_PROPERTIES.find((p) => p.slug === slug) || null;
}

export async function generateMetadata(
  props: PageProps<"/nehnutelnost/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return { title: "Nehnuteľnosť nenájdená" };
  }

  const title = `${property.title} - ${formatPrice(property.price)}`;
  const description = `${PROPERTY_TYPE_LABELS[property.type]} na ${TRANSACTION_LABELS[property.transaction].toLowerCase()} v ${property.city}. ${formatArea(property.area)}, ${getRoomsLabel(property.rooms)}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: property.image_url ? [property.image_url] : [],
    },
  };
}

export default async function PropertyDetailPage(
  props: PageProps<"/nehnutelnost/[slug]">
) {
  const { slug } = await props.params;
  const property = getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.title,
    url: `${SITE_URL}/nehnutelnost/${property.slug}`,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.district || undefined,
      addressCountry: "SK",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="bg-bg-subtle min-h-screen" data-property-id={property.id}>
        {/* Breadcrumb */}
        <nav className="container py-4" aria-label="Navigačná cesta">
          <ol className="flex items-center gap-2 text-sm text-text-muted">
            <li>
              <Link href="/" className="hover:text-brand transition-colors">
                Domov
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/nehnutelnosti"
                className="hover:text-brand transition-colors"
              >
                Nehnuteľnosti
              </Link>
            </li>
            <li>/</li>
            <li className="text-text font-medium truncate max-w-[200px]">
              {property.title}
            </li>
          </ol>
        </nav>

        <div className="container pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden bg-white border border-border">
                {property.image_url ? (
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={property.image_url}
                      alt={property.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-bg-muted flex items-center justify-center text-text-faint">
                    Bez fotografie
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl border border-border p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge variant="brand">
                    {TRANSACTION_LABELS[property.transaction]}
                  </Badge>
                  <Badge>
                    {PROPERTY_TYPE_LABELS[property.type]}
                  </Badge>
                  {property.is_featured && <Badge variant="amber">Top</Badge>}
                </div>

                <h1 className="text-2xl font-bold text-text mb-2">
                  {property.title}
                </h1>
                <p className="text-text-muted flex items-center gap-1 mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {property.city}
                  {property.district && `, ${property.district}`}
                </p>

                {/* Key params */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-bg-subtle rounded-xl mb-6">
                  <div>
                    <p className="text-xs text-text-faint mb-1">Plocha</p>
                    <p className="text-sm font-semibold text-text">
                      {formatArea(property.area)}
                    </p>
                  </div>
                  {property.rooms > 0 && (
                    <div>
                      <p className="text-xs text-text-faint mb-1">Izby</p>
                      <p className="text-sm font-semibold text-text">
                        {property.rooms}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-faint mb-1">Typ</p>
                    <p className="text-sm font-semibold text-text">
                      {PROPERTY_TYPE_LABELS[property.type]}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-faint mb-1">Transakcia</p>
                    <p className="text-sm font-semibold text-text">
                      {TRANSACTION_LABELS[property.transaction]}
                    </p>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-text mb-3">Popis</h2>
                <p className="text-text-secondary leading-relaxed">
                  Táto nehnuteľnosť je k dispozícii na {TRANSACTION_LABELS[property.transaction].toLowerCase()}.
                  Nachádza sa v lokalite {property.city}
                  {property.district && ` - ${property.district}`}.
                  Celková plocha je {formatArea(property.area)}
                  {property.rooms > 0 && ` s ${property.rooms} izbami`}.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Price card */}
              <div className="bg-white rounded-2xl border border-border p-6 sticky top-24">
                <p className="text-3xl font-bold text-brand mb-1">
                  {formatPrice(property.price)}
                </p>
                {property.transaction === "rent" && (
                  <p className="text-sm text-text-muted">/ mesiac</p>
                )}

                <hr className="my-5 border-border" />

                <Button className="w-full mb-3" size="lg">
                  Kontaktovať makléra
                </Button>
                <Button variant="secondary" className="w-full" size="lg">
                  Uložiť do obľúbených
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  );
}
