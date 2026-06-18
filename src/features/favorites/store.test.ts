import { beforeEach, describe, expect, it } from "vitest";

import type { MovieSummary } from "@/lib/omdb/types";

import { useFavoritesStore } from "./store";

const movie: MovieSummary = {
  id: "tt0133093",
  title: "The Matrix",
  year: "1999",
  type: "movie",
  poster: null,
};

beforeEach(() => {
  useFavoritesStore.setState({ items: [] });
  localStorage.clear();
});

describe("favorites store", () => {
  it("adds a movie on first toggle", () => {
    useFavoritesStore.getState().toggle(movie);
    expect(useFavoritesStore.getState().items).toHaveLength(1);
    expect(useFavoritesStore.getState().items[0].id).toBe(movie.id);
  });

  it("removes a movie on second toggle", () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(movie);
    toggle(movie);
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });

  it("removes by id", () => {
    useFavoritesStore.getState().toggle(movie);
    useFavoritesStore.getState().remove(movie.id);
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });

  it("clears all favorites", () => {
    useFavoritesStore.getState().toggle(movie);
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().items).toHaveLength(0);
  });
});
