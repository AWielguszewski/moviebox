import type { MovieType } from "@/lib/omdb/schemas";
import type { SearchPage } from "@/lib/omdb/types";

export interface SearchQuery {
  q: string;
  year?: string;
  type?: MovieType;
  page: number;
}

export async function fetchSearch(query: SearchQuery): Promise<SearchPage> {
  const params = new URLSearchParams({ q: query.q, page: String(query.page) });
  if (query.year) params.set("year", query.year);
  if (query.type) params.set("type", query.type);

  const response = await fetch(`/api/omdb/search?${params.toString()}`);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as
      | { error?: { message?: string } }
      | null;
    throw new Error(body?.error?.message ?? "Search request failed.");
  }

  return response.json() as Promise<SearchPage>;
}
