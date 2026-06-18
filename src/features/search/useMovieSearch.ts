import { useInfiniteQuery } from "@tanstack/react-query";

import type { MovieType } from "@/lib/omdb/schemas";

import { fetchSearch } from "./api";
import { searchQueryKey } from "./searchQueryKey";

export interface MovieSearchArgs {
  q: string;
  year?: string;
  type?: MovieType;
}

export function useMovieSearch({ q, year, type }: MovieSearchArgs) {
  const query = q.trim();

  return useInfiniteQuery({
    queryKey: searchQueryKey({ q: query, year, type }),
    enabled: query.length > 0,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchSearch({ q: query, year, type, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
