import type { Metadata } from "next";
import { Suspense } from "react";
import { SITE_NAME } from "@/lib/constants";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Nehnuteľnosti na predaj a prenájom",
  description: `Prehľadajte stovky nehnuteľností na Slovensku. Byty, domy, pozemky a komerčné priestory na predaj aj prenájom na ${SITE_NAME}.`,
};

export default async function NehnutelnostiPage(props: PageProps<"/nehnutelnosti">) {
  const searchParams = await props.searchParams;

  return (
    <div className="bg-bg-subtle min-h-screen">
      <div className="container py-8">
        <h1 className="text-2xl font-bold text-text mb-6">
          Nehnuteľnosti
        </h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-white overflow-hidden">
                  <div className="aspect-[4/3] shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 w-24 shimmer rounded" />
                    <div className="h-4 w-full shimmer rounded" />
                    <div className="h-3 w-32 shimmer rounded" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <SearchClient initialParams={searchParams as Record<string, string>} />
        </Suspense>
      </div>
    </div>
  );
}
