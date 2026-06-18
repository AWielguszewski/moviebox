import { MovieCard } from "@/components/movie/MovieCard";
import type { MovieSummary } from "@/lib/omdb/types";

export function MovieGrid({ movies }: { movies: MovieSummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie, index) => (
        <li key={movie.id}>
          <MovieCard movie={movie} priority={index === 0} />
        </li>
      ))}
    </ul>
  );
}
