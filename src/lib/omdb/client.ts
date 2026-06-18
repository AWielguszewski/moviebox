import "server-only";

import { err, mapOmdbError, ok, type Result } from "./errors";
import { MOCK_MOVIES } from "./mocks";
import {
  detailResponseSchema,
  searchResponseSchema,
  type MovieDetail,
} from "./schemas";
import {
  OMDB_PAGE_SIZE,
  toSearchPage,
  type SearchPage,
  type SearchParams,
} from "./types";

const BASE_URL = "https://www.omdbapi.com/";

const SEARCH_REVALIDATE_SECONDS = 60 * 60;
const DETAIL_REVALIDATE_SECONDS = 60 * 60 * 24;

function getApiKey(): string | undefined {
  return process.env.OMDB_API_KEY?.trim() || undefined;
}

export function isUsingMocks(): boolean {
  return getApiKey() === undefined;
}

function buildUrl(params: Record<string, string>): string {
  const url = new URL(BASE_URL);
  url.searchParams.set("apikey", getApiKey() ?? "");
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

async function fetchJson(
  url: string,
  revalidate: number,
): Promise<Result<unknown>> {
  try {
    const response = await fetch(url, { next: { revalidate } });
    if (!response.ok) {
      return err("NETWORK", `OMDb responded with status ${response.status}.`);
    }
    return ok(await response.json());
  } catch {
    return err("NETWORK", "Could not reach the OMDb API.");
  }
}

export async function searchMovies(
  params: SearchParams,
): Promise<Result<SearchPage>> {
  const query = params.query.trim();
  const page = params.page ?? 1;

  if (query.length === 0) {
    return ok(toSearchPage([], 0, page));
  }

  if (isUsingMocks()) {
    return mockSearch({ ...params, query, page });
  }

  const fetched = await fetchJson(
    buildUrl({
      s: query,
      type: params.type ?? "",
      y: params.year ?? "",
      page: String(page),
    }),
    SEARCH_REVALIDATE_SECONDS,
  );
  if (!fetched.ok) return fetched;

  const parsed = searchResponseSchema.safeParse(fetched.data);
  if (!parsed.success) {
    return err("INVALID_RESPONSE", "Unexpected response format from OMDb.");
  }

  if (parsed.data.Response === "False") {
    const mapped = mapOmdbError(parsed.data.Error);
    // No results is not an error: return an empty page.
    if (mapped.code === "NOT_FOUND") {
      return ok(toSearchPage([], 0, page));
    }
    return { ok: false, error: mapped };
  }

  const total = Number.parseInt(parsed.data.totalResults, 10) || 0;
  return ok(toSearchPage(parsed.data.Search, total, page));
}

export async function getMovieById(id: string): Promise<Result<MovieDetail>> {
  const imdbId = id.trim();
  if (imdbId.length === 0) {
    return err("NOT_FOUND", "Missing title identifier.");
  }

  if (isUsingMocks()) {
    return mockDetail(imdbId);
  }

  const fetched = await fetchJson(
    buildUrl({ i: imdbId, plot: "full" }),
    DETAIL_REVALIDATE_SECONDS,
  );
  if (!fetched.ok) return fetched;

  const parsed = detailResponseSchema.safeParse(fetched.data);
  if (!parsed.success) {
    return err("INVALID_RESPONSE", "Unexpected response format from OMDb.");
  }

  if (parsed.data.Response === "False") {
    return { ok: false, error: mapOmdbError(parsed.data.Error) };
  }

  return ok(parsed.data);
}

function mockSearch(params: SearchParams): Result<SearchPage> {
  const query = params.query.toLowerCase();
  const page = params.page ?? 1;

  const filtered = MOCK_MOVIES.filter((movie) => {
    const matchesQuery = movie.Title.toLowerCase().includes(query);
    const matchesType = params.type ? movie.Type === params.type : true;
    const matchesYear = params.year ? movie.Year.includes(params.year) : true;
    return matchesQuery && matchesType && matchesYear;
  });

  const start = (page - 1) * OMDB_PAGE_SIZE;
  const pageItems = filtered.slice(start, start + OMDB_PAGE_SIZE);

  return ok(
    toSearchPage(
      pageItems.map((movie) => ({
        Title: movie.Title,
        Year: movie.Year,
        imdbID: movie.imdbID,
        Type: movie.Type,
        Poster: movie.Poster ?? "N/A",
      })),
      filtered.length,
      page,
    ),
  );
}

function mockDetail(id: string): Result<MovieDetail> {
  const found = MOCK_MOVIES.find((movie) => movie.imdbID === id);
  if (!found) {
    return { ok: false, error: mapOmdbError("Incorrect IMDb ID.") };
  }
  return ok(found);
}
