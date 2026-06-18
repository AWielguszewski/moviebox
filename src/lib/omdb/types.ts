import type { MovieDetail, MovieType, SearchItem } from "./schemas";

export const OMDB_PAGE_SIZE = 10;
export const OMDB_MAX_RESULTS = 100;

export interface MovieSummary {
  id: string;
  title: string;
  year: string;
  type: string;
  poster: string | null;
}

export interface SearchPage {
  items: MovieSummary[];
  totalResults: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchParams {
  query: string;
  year?: string;
  type?: MovieType;
  page?: number;
}

// OMDb uses the literal "N/A" to signal missing data.
export function cleanField(value: string | undefined | null): string | null {
  if (!value || value === "N/A") return null;
  return value;
}

export function toMovieSummary(item: SearchItem): MovieSummary {
  return {
    id: item.imdbID,
    title: item.Title,
    year: item.Year,
    type: item.Type,
    poster: cleanField(item.Poster),
  };
}

export function toSearchPage(
  items: SearchItem[],
  totalResults: number,
  page: number,
): SearchPage {
  const cappedTotal = Math.min(totalResults, OMDB_MAX_RESULTS);
  const totalPages = Math.max(1, Math.ceil(cappedTotal / OMDB_PAGE_SIZE));

  return {
    items: items.map(toMovieSummary),
    totalResults,
    page,
    totalPages,
    hasMore: page < totalPages,
  };
}

export function detailPoster(detail: MovieDetail): string | null {
  return cleanField(detail.Poster);
}

export function detailToSummary(detail: MovieDetail): MovieSummary {
  return {
    id: detail.imdbID,
    title: detail.Title,
    year: detail.Year,
    type: detail.Type,
    poster: cleanField(detail.Poster),
  };
}
