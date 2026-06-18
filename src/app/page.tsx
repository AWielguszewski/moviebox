import Link from "next/link";

import { PosterMosaic } from "@/components/home/PosterMosaic";
import { SearchBar } from "@/components/layout/SearchBar";
import { getMosaicItems } from "@/lib/omdb/curated";

const SUGGESTIONS = ["Batman", "Star Wars", "Matrix", "Breaking Bad"];

export default async function HomePage() {
  const mosaicItems = await getMosaicItems();

  return (
    <main className="relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-4 py-20">
      <PosterMosaic items={mosaicItems} />

      <section className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted">
          Moviebox
        </p>
        <h1 className="text-balance text-4xl font-bold sm:text-6xl">
          Find your next watch
        </h1>
        <p className="max-w-md text-pretty text-muted">
          Search thousands of movies and series, dive into the details and keep
          your favorites in one place.
        </p>

        <SearchBar variant="hero" className="max-w-xl" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs text-muted">Try:</span>
          {SUGGESTIONS.map((term) => (
            <Link
              key={term}
              href={`/search?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted backdrop-blur transition-colors hover:border-accent hover:text-foreground"
            >
              {term}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
