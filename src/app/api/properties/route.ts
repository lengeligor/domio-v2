import { NextResponse } from "next/server";
import { MOCK_PROPERTIES } from "@/lib/mock-data";

// Public REST API for AI agents and external consumers
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const transaction = searchParams.get("transaction");
  const city = searchParams.get("city");

  // TODO: Replace with Supabase query
  let results = [...MOCK_PROPERTIES];

  if (type) results = results.filter((p) => p.type === type);
  if (transaction)
    results = results.filter((p) => p.transaction === transaction);
  if (city) results = results.filter((p) => p.city === city);

  return NextResponse.json({
    data: results,
    total: results.length,
    filters: { type, transaction, city },
  });
}
