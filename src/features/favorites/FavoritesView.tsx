"use client";

import Link from "next/link";

import { MovieGrid } from "@/components/movie/MovieGrid";
import { MovieGridSkeleton } from "@/components/movie/MovieGridSkeleton";
import { HeartIcon } from "@/components/ui/icons";
import { StatusMessage } from "@/components/ui/StatusMessage";

import { useFavoritesStore, useHasHydrated } from "./store";

export function FavoritesView() {
  const hydrated = useHasHydrated();
  const items = useFavoritesStore((state) => state.items);
  const clear = useFavoritesStore((state) => state.clear);

  if (!hydrated) {
    return <MovieGridSkeleton />;
  }

  if (items.length === 0) {
    return (
      <StatusMessage
        icon={<HeartIcon className="h-10 w-10" />}
        title="No favorites yet"
        description="Save titles by tapping the heart icon to find them here later."
      >
        <Link
          href="/search"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Browse movies
        </Link>
      </StatusMessage>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {items.length} saved title{items.length === 1 ? "" : "s"}
        </p>
        <button
          type="button"
          onClick={clear}
          className="rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
        >
          Clear all
        </button>
      </div>
      <MovieGrid movies={items} />
    </div>
  );
}
