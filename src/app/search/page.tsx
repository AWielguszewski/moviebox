import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";

import { MovieGridSkeleton } from "@/components/movie/MovieGridSkeleton";
import { parseSearchPageParams } from "@/features/search/params";
import { prefetchSearch } from "@/features/search/prefetchSearch";
import { SearchView } from "@/features/search/SearchView";

export const metadata: Metadata = {
  title: "Search",
  description: "Search movies and series.",
};

type SearchParams = Promise<{ q?: string; year?: string; type?: string }>;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = parseSearchPageParams(await searchParams);
  const queryClient = new QueryClient();

  if (params.q.length > 0) {
    try {
      await prefetchSearch(queryClient, params);
    } catch {
      // Allow the client to fetch results instead.
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
            <MovieGridSkeleton />
          </main>
        }
      >
        <SearchView />
      </Suspense>
    </HydrationBoundary>
  );
}
