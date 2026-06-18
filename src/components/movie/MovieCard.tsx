import Link from "next/link";

import { FavoriteButton } from "@/components/movie/FavoriteButton";
import { PosterImage } from "@/components/movie/PosterImage";
import type { MovieSummary } from "@/lib/omdb/types";

const TYPE_LABELS: Record<string, string> = {
  movie: "Movie",
  series: "Series",
  episode: "Episode",
  game: "Game",
};

export function MovieCard({
  movie,
  priority = false,
}: {
  movie: MovieSummary;
  priority?: boolean;
}) {
  return (
    <div className="group relative">
      <Link
        href={`/movie/${movie.id}`}
        className="block rounded-card focus-visible:outline-none"
      >
        <div className="relative overflow-hidden rounded-card border border-border/60 bg-surface">
          <PosterImage
            poster={movie.poster}
            title={movie.title}
            priority={priority}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute left-2 top-2 rounded-full bg-background/80 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted backdrop-blur">
            {TYPE_LABELS[movie.type] ?? movie.type}
          </span>
        </div>
        <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-foreground group-hover:text-accent">
          {movie.title}
        </h3>
        <p className="text-xs text-muted">{movie.year}</p>
      </Link>
      <FavoriteButton movie={movie} className="absolute right-2 top-2 z-10" />
    </div>
  );
}
