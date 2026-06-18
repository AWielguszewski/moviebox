import { NextResponse, type NextRequest } from "next/server";

import { searchMovies } from "@/lib/omdb/client";
import type { OmdbErrorCode } from "@/lib/omdb/errors";
import { movieTypeSchema } from "@/lib/omdb/schemas";

const STATUS_BY_CODE: Record<OmdbErrorCode, number> = {
  NOT_FOUND: 404,
  TOO_MANY_RESULTS: 400,
  RATE_LIMIT: 429,
  INVALID_KEY: 500,
  MISSING_KEY: 500,
  INVALID_RESPONSE: 502,
  NETWORK: 502,
  API_ERROR: 502,
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q")?.trim() ?? "";
  const year = searchParams.get("year")?.trim() || undefined;
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10) || 1;

  const typeParam = searchParams.get("type") ?? undefined;
  const parsedType = typeParam
    ? movieTypeSchema.safeParse(typeParam)
    : undefined;
  const type = parsedType?.success ? parsedType.data : undefined;

  const result = await searchMovies({ query, year, type, page });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error },
      { status: STATUS_BY_CODE[result.error.code] },
    );
  }

  return NextResponse.json(result.data);
}
