import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { searchMovies } from "@/lib/omdb/client";
import type { MovieType } from "@/lib/omdb/schemas";
import type { SearchPage } from "@/lib/omdb/types";

import { searchQueryKey } from "./searchQueryKey";

async function fetchSearchPage(params: {
  q: string;
  year?: string;
  type?: MovieType;
  page: number;
}): Promise<SearchPage> {
  const result = await searchMovies({
    query: params.q,
    year: params.year,
    type: params.type,
    page: params.page,
  });

  if (!result.ok) {
    throw new Error(result.error.message);
  }

  return result.data;
}

export async function prefetchSearch(
  queryClient: QueryClient,
  { q, year, type }: { q: string; year?: string; type?: MovieType },
) {
  const query = q.trim();
  if (query.length === 0) return;

  await queryClient.prefetchInfiniteQuery({
    queryKey: searchQueryKey({ q: query, year, type }),
    queryFn: ({ pageParam }) =>
      fetchSearchPage({ q: query, year, type, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: SearchPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
