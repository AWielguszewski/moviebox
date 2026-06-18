import { PosterImage } from "@/components/movie/PosterImage";
import { StarIcon } from "@/components/ui/icons";
import type { MovieDetail } from "@/lib/omdb/schemas";
import { cleanField } from "@/lib/omdb/types";

const TYPE_LABELS: Record<string, string> = {
  movie: "Movie",
  series: "Series",
  episode: "Episode",
  game: "Game",
};

function MetaItem({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

export function MovieDetails({
  detail,
  actions,
}: {
  detail: MovieDetail;
  actions?: React.ReactNode;
}) {
  const poster = cleanField(detail.Poster);
  const plot = cleanField(detail.Plot);
  const genres = cleanField(detail.Genre)
    ?.split(",")
    .map((genre) => genre.trim());
  const imdbRating = cleanField(detail.imdbRating ?? null);
  const metascore = cleanField(detail.Metascore ?? null);
  const rottenTomatoes = detail.Ratings?.find(
    (rating) => rating.Source === "Rotten Tomatoes",
  )?.Value;

  const metaLine = [
    cleanField(detail.Rated ?? null),
    cleanField(detail.Runtime ?? null),
    TYPE_LABELS[detail.Type] ?? detail.Type,
  ].filter(Boolean);

  return (
    <article className="grid gap-6 sm:grid-cols-[minmax(0,200px)_1fr] sm:gap-8">
      <div className="mx-auto w-40 sm:mx-0 sm:w-full">
        <PosterImage
          poster={poster}
          title={detail.Title}
          priority
          sizes="(max-width: 640px) 40vw, 200px"
          className="rounded-card shadow-xl"
        />
      </div>

      <div className="space-y-5">
        <header className="space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-2xl font-bold sm:text-3xl">
              {detail.Title}{" "}
              <span className="font-normal text-muted">({detail.Year})</span>
            </h1>
            {actions}
          </div>
          {metaLine.length > 0 && (
            <p className="text-sm text-muted">{metaLine.join(" · ")}</p>
          )}
        </header>

        {genres && genres.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted"
              >
                {genre}
              </li>
            ))}
          </ul>
        )}

        {(imdbRating || metascore || rottenTomatoes) && (
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {imdbRating && (
              <span className="flex items-center gap-1.5">
                <StarIcon filled className="h-4 w-4 text-yellow-400" />
                <span className="font-semibold text-foreground">
                  {imdbRating}
                </span>
                <span className="text-muted">IMDb</span>
              </span>
            )}
            {rottenTomatoes && (
              <span className="text-foreground">
                {rottenTomatoes}{" "}
                <span className="text-muted">Rotten Tomatoes</span>
              </span>
            )}
            {metascore && (
              <span className="text-foreground">
                {metascore} <span className="text-muted">Metascore</span>
              </span>
            )}
          </div>
        )}

        {plot && <p className="text-pretty text-foreground/90">{plot}</p>}

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetaItem label="Director" value={cleanField(detail.Director ?? null)} />
          <MetaItem label="Writer" value={cleanField(detail.Writer ?? null)} />
          <MetaItem label="Cast" value={cleanField(detail.Actors ?? null)} />
          <MetaItem
            label="Language"
            value={cleanField(detail.Language ?? null)}
          />
          <MetaItem label="Country" value={cleanField(detail.Country ?? null)} />
          <MetaItem
            label="Released"
            value={cleanField(detail.Released ?? null)}
          />
          <MetaItem label="Awards" value={cleanField(detail.Awards ?? null)} />
          {detail.totalSeasons && (
            <MetaItem label="Seasons" value={detail.totalSeasons} />
          )}
        </dl>
      </div>
    </article>
  );
}
