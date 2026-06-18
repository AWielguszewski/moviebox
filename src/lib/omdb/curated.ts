import "server-only";

import { isUsingMocks, searchMovies } from "./client";
import { MOCK_MOVIES } from "./mocks";
import { cleanField, type MovieSummary } from "./types";

const MOSAIC_QUERIES = [
  "Avengers",
  "Star Wars",
  "Batman",
  "Harry Potter",
  "Lord",
  "Mission",
  "Spider",
  "James Bond",
];

function mockMosaicItems(): MovieSummary[] {
  return MOCK_MOVIES.map((movie) => ({
    id: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    type: movie.Type,
    poster: cleanField(movie.Poster),
  }));
}

export async function getMosaicItems(limit = 24): Promise<MovieSummary[]> {
  if (isUsingMocks()) {
    return mockMosaicItems();
  }

  const results = await Promise.all(
    MOSAIC_QUERIES.map((query) => searchMovies({ query })),
  );

  const seen = new Set<string>();
  const items: MovieSummary[] = [];
  for (const result of results) {
    if (!result.ok) continue;
    for (const item of result.data.items) {
      if (seen.has(item.id) || !item.poster) continue;
      seen.add(item.id);
      items.push(item);
    }
  }

  return items.slice(0, limit);
}
