"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { MovieGrid } from "@/components/movie/MovieGrid";
import { MovieGridSkeleton } from "@/components/movie/MovieGridSkeleton";
import { FilmIcon, SearchIcon } from "@/components/ui/icons";
import { StatusMessage } from "@/components/ui/StatusMessage";
import { MOVIE_TYPES, type MovieType } from "@/lib/omdb/schemas";
import type { MovieSummary } from "@/lib/omdb/types";

import { useMovieSearch } from "./useMovieSearch";

const TYPE_OPTIONS: { value: "" | MovieType; label: string }[] = [
  { value: "", label: "All types" },
  { value: "movie", label: "Movies" },
  { value: "series", label: "Series" },
  { value: "episode", label: "Episodes" },
];

const CURRENT_YEAR = new Date().getFullYear();

function parseType(value: string): MovieType | undefined {
  return (MOVIE_TYPES as readonly string[]).includes(value)
    ? (value as MovieType)
    : undefined;
}

export function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const year = searchParams.get("year") ?? "";
  const type = parseType(searchParams.get("type") ?? "");

  const [queryInput, setQueryInput] = useState(q);
  const [yearInput, setYearInput] = useState(year);
  const [typeInput, setTypeInput] = useState<"" | MovieType>(type ?? "");

  useEffect(() => {
    setQueryInput(q);
    setYearInput(year);
    setTypeInput(type ?? "");
  }, [q, year, type]);

  function applyParams(next: { q: string; year: string; type: "" | MovieType }) {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.year.trim()) params.set("year", next.year.trim());
    if (next.type) params.set("type", next.type);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyParams({ q: queryInput, year: yearInput, type: typeInput });
  }

  const search = useMovieSearch({
    q,
    year: year || undefined,
    type,
  });

  const movies = search.data?.pages.flatMap((page) => page.items) ?? [];
  const totalResults = search.data?.pages[0]?.totalResults ?? 0;

  const sentinelRef = useRef<HTMLDivElement>(null);
  const { hasNextPage, isFetchingNextPage, fetchNextPage } = search;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
      <form
        role="search"
        onSubmit={handleSubmit}
        className="sticky top-16 z-30 -mx-4 mb-6 flex flex-col gap-3 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur sm:mx-0 sm:flex-row sm:items-center sm:rounded-xl sm:border sm:px-4"
      >
        <div className="relative flex-1">
          <label htmlFor="search-input" className="sr-only">
            Search movies and series
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            id="search-input"
            type="search"
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search movies, series…"
            autoComplete="off"
            className="w-full rounded-full border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus-visible:border-accent"
          />
        </div>

        <div className="flex gap-3">
          <div>
            <label htmlFor="year-input" className="sr-only">
              Release year
            </label>
            <input
              id="year-input"
              type="number"
              inputMode="numeric"
              min={1888}
              max={CURRENT_YEAR + 1}
              value={yearInput}
              onChange={(event) => setYearInput(event.target.value)}
              placeholder="Year"
              className="w-24 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus-visible:border-accent"
            />
          </div>

          <div>
            <label htmlFor="type-select" className="sr-only">
              Title type
            </label>
            <select
              id="type-select"
              value={typeInput}
              onChange={(event) => {
                const value = event.target.value as "" | MovieType;
                setTypeInput(value);
                applyParams({ q: queryInput, year: yearInput, type: value });
              }}
              className="rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-foreground focus-visible:border-accent"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Search
          </button>
        </div>
      </form>

      <SearchResults
        query={q}
        movies={movies}
        totalResults={totalResults}
        status={search.status}
        isFetched={search.isFetched}
        error={search.error}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
        sentinelRef={sentinelRef}
      />
    </main>
  );
}

interface SearchResultsProps {
  query: string;
  movies: MovieSummary[];
  totalResults: number;
  status: ReturnType<typeof useMovieSearch>["status"];
  isFetched: boolean;
  error: unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  sentinelRef: React.RefObject<HTMLDivElement | null>;
}

function SearchResults({
  query,
  movies,
  totalResults,
  status,
  isFetched,
  error,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  sentinelRef,
}: SearchResultsProps) {
  if (query.trim().length === 0) {
    return (
      <StatusMessage
        icon={<SearchIcon className="h-10 w-10" />}
        title="Start searching"
        description="Type a movie or series title to see results."
      />
    );
  }

  if (status === "pending") {
    return <MovieGridSkeleton />;
  }

  if (status === "error") {
    return (
      <StatusMessage
        icon={<FilmIcon className="h-10 w-10" />}
        title="Something went wrong"
        description={
          error instanceof Error ? error.message : "Please try again."
        }
      />
    );
  }

  if (isFetched && movies.length === 0) {
    return (
      <StatusMessage
        icon={<FilmIcon className="h-10 w-10" />}
        title="No results found"
        description={`No titles match “${query}”. Try a different search or filters.`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <p aria-live="polite" className="text-sm text-muted">
        {totalResults} result{totalResults === 1 ? "" : "s"} for “{query}”
      </p>

      <MovieGrid movies={movies} />

      <div ref={sentinelRef} aria-hidden className="h-px" />

      {isFetchingNextPage && <MovieGridSkeleton count={5} />}

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => fetchNextPage()}
            className="rounded-full border border-border bg-surface px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
