import { MOVIE_TYPES, type MovieType } from "@/lib/omdb/schemas";

export function parseMovieType(value: string | undefined): MovieType | undefined {
  return (MOVIE_TYPES as readonly string[]).includes(value ?? "")
    ? (value as MovieType)
    : undefined;
}

export interface SearchPageParams {
  q: string;
  year?: string;
  type?: MovieType;
}

export function parseSearchPageParams(searchParams: {
  q?: string;
  year?: string;
  type?: string;
}): SearchPageParams {
  const q = searchParams.q?.trim() ?? "";
  const year = searchParams.year?.trim() || undefined;
  const type = parseMovieType(searchParams.type);
  return { q, year, type };
}
