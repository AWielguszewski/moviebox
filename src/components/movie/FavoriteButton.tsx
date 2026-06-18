"use client";

import { HeartIcon } from "@/components/ui/icons";
import {
  useFavoritesStore,
  useHasHydrated,
  useIsFavorite,
} from "@/features/favorites/store";
import type { MovieSummary } from "@/lib/omdb/types";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  movie: MovieSummary;
  variant?: "icon" | "labeled";
  className?: string;
}

export function FavoriteButton({
  movie,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  const hydrated = useHasHydrated();
  const stored = useIsFavorite(movie.id);
  const toggle = useFavoritesStore((state) => state.toggle);

  const active = hydrated && stored;
  const label = active ? "Remove from favorites" : "Add to favorites";

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    toggle(movie);
  }

  if (variant === "labeled") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={active}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
          active
            ? "border-accent bg-accent/10 text-accent"
            : "border-border bg-surface text-foreground hover:border-accent",
          className,
        )}
      >
        <HeartIcon filled={active} className="h-4 w-4" />
        {active ? "In favorites" : "Add to favorites"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full bg-background/70 p-2 backdrop-blur transition-colors hover:bg-background",
        active ? "text-accent" : "text-white/90 hover:text-accent",
        className,
      )}
    >
      <HeartIcon filled={active} className="h-5 w-5" />
    </button>
  );
}
