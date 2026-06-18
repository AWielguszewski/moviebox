import type { Metadata } from "next";
import { Suspense } from "react";

import { MovieGridSkeleton } from "@/components/movie/MovieGridSkeleton";
import { SearchView } from "@/features/search/SearchView";

type SearchParams = Promise<{ q?: string; year?: string; type?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  return {
    title: query ? `Search: ${query}` : "Search",
    description: query
      ? `Search results for “${query}”.`
      : "Search movies and series.",
  };
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
          <MovieGridSkeleton />
        </main>
      }
    >
      <SearchView />
    </Suspense>
  );
}
