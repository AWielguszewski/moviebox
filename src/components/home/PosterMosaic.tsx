"use client";

import { useMemo } from "react";

import { PosterImage } from "@/components/movie/PosterImage";
import { useFavoritesStore, useHasHydrated } from "@/features/favorites/store";
import type { MovieSummary } from "@/lib/omdb/types";
import { cn } from "@/lib/utils";

const COLUMN_COUNT = 6;
const MIN_TILES_PER_COLUMN = 6;

const COLUMN_VISIBILITY = [
  "",
  "",
  "",
  "hidden sm:block",
  "hidden lg:block",
  "hidden xl:block",
];

function buildColumns(items: MovieSummary[]): MovieSummary[][] {
  const columns: MovieSummary[][] = Array.from(
    { length: COLUMN_COUNT },
    () => [],
  );

  if (items.length === 0) return columns;

  items.forEach((item, index) => {
    columns[index % COLUMN_COUNT].push(item);
  });

  return columns.map((column) => {
    const filled = column.length > 0 ? column : items;
    const result = [...filled];
    while (result.length < MIN_TILES_PER_COLUMN) {
      result.push(...filled);
    }
    return result;
  });
}

export function PosterMosaic({ items }: { items: MovieSummary[] }) {
  const hydrated = useHasHydrated();
  const favorites = useFavoritesStore((state) => state.items);

  // After hydration, surface the user's favorites first and fill the rest
  // with the curated list, so the home page feels personalized.
  const mosaicItems = useMemo(() => {
    if (!hydrated || favorites.length === 0) return items;
    const favoriteIds = new Set(favorites.map((item) => item.id));
    return [...favorites, ...items.filter((item) => !favoriteIds.has(item.id))];
  }, [hydrated, favorites, items]);

  const columns = useMemo(() => buildColumns(mosaicItems), [mosaicItems]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      <div className="flex h-full gap-3 px-3">
        {columns.map((column, columnIndex) => {
          const direction = columnIndex % 2 === 0 ? "mosaic-up" : "mosaic-down";
          const duration = 140 + columnIndex * 18;
          const loop = [...column, ...column];

          return (
            <div
              key={columnIndex}
              className={cn("h-full flex-1", COLUMN_VISIBILITY[columnIndex])}
            >
              <div
                className="flex flex-col gap-3"
                style={{
                  animation: `${direction} ${duration}s linear infinite`,
                }}
              >
                {loop.map((item, tileIndex) => (
                  <PosterImage
                    key={`${columnIndex}-${tileIndex}-${item.id}`}
                    poster={item.poster}
                    title={item.title}
                    decorative
                    sizes="(max-width: 768px) 33vw, 16vw"
                    className="rounded-lg opacity-70"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, rgba(11,11,15,0.92) 0%, rgba(11,11,15,0.62) 42%, rgba(11,11,15,0.9) 100%)",
        }}
      />
    </div>
  );
}
