import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/utils";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

export default function DashboardPage() {
  // TODO: Replace with Supabase query for agent's own properties
  const properties = MOCK_PROPERTIES;

  const stats = [
    { label: "Aktívne inzeráty", value: properties.length, color: "text-brand" },
    {
      label: "Celkové zobrazenia",
      value: "1,234",
      color: "text-green",
    },
    {
      label: "Tento mesiac",
      value: "56",
      color: "text-amber",
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Dashboard</h1>
          <p className="text-text-muted mt-1">
            Správa vašich nehnuteľností
          </p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Pridať inzerát
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <p className="text-sm text-text-muted">{stat.label}</p>
              <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Properties table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium text-text-muted">
                  Nehnuteľnosť
                </th>
                <th className="text-left p-4 font-medium text-text-muted">
                  Cena
                </th>
                <th className="text-left p-4 font-medium text-text-muted">
                  Typ
                </th>
                <th className="text-left p-4 font-medium text-text-muted">
                  Status
                </th>
                <th className="text-right p-4 font-medium text-text-muted">
                  Akcie
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.id}
                  className="border-b border-border-light hover:bg-bg-subtle transition-colors"
                >
                  <td className="p-4">
                    <p className="font-medium text-text line-clamp-1">
                      {property.title}
                    </p>
                    <p className="text-xs text-text-faint mt-0.5">
                      {property.city}
                      {property.district && `, ${property.district}`}
                    </p>
                  </td>
                  <td className="p-4 font-semibold text-brand">
                    {formatPrice(property.price)}
                  </td>
                  <td className="p-4">
                    <Badge>{property.type === "apartment" ? "Byt" : property.type === "house" ? "Dom" : property.type === "land" ? "Pozemok" : "Komerčný"}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="green">Aktívny</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/nehnutelnost/${property.slug}`}
                      className="text-brand hover:underline text-xs font-medium"
                    >
                      Zobraziť
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
