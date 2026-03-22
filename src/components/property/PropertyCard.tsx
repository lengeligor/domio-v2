import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, formatArea, getRoomsLabel } from "@/lib/utils";
import { PROPERTY_TYPE_LABELS, TRANSACTION_LABELS } from "@/lib/constants";
import type { PropertyCard as PropertyCardType } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyCardType;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link href={`/nehnutelnost/${property.slug}`}>
      <Card
        hover
        className="group"
        data-property-id={property.id}
        data-property-price={property.price}
        data-property-type={property.type}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-muted">
          {property.image_url ? (
            <Image
              src={property.image_url}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-faint">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant="brand">
              {TRANSACTION_LABELS[property.transaction]}
            </Badge>
            {property.is_featured && (
              <Badge variant="amber">Top</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <article className="p-4">
          <p className="text-lg font-bold text-brand mb-1">
            {formatPrice(property.price)}
          </p>
          <h3 className="text-sm font-semibold text-text line-clamp-1 mb-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-3 text-xs text-text-muted">
            <span>{PROPERTY_TYPE_LABELS[property.type]}</span>
            {property.rooms > 0 && (
              <>
                <span className="text-border">|</span>
                <span>{getRoomsLabel(property.rooms)}</span>
              </>
            )}
            <span className="text-border">|</span>
            <span>{formatArea(property.area)}</span>
          </div>
          <p className="mt-2 text-xs text-text-faint flex items-center gap-1">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {property.city}
            {property.district && `, ${property.district}`}
          </p>
        </article>
      </Card>
    </Link>
  );
}
