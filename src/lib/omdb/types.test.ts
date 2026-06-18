import { describe, expect, it } from "vitest";

import type { SearchItem } from "./schemas";
import { cleanField, toMovieSummary, toSearchPage } from "./types";

describe("cleanField", () => {
  it("returns null for 'N/A', empty and nullish values", () => {
    expect(cleanField("N/A")).toBeNull();
    expect(cleanField("")).toBeNull();
    expect(cleanField(undefined)).toBeNull();
  });

  it("returns the value otherwise", () => {
    expect(cleanField("Action")).toBe("Action");
  });
});

describe("toMovieSummary", () => {
  it("normalizes an OMDb search item", () => {
    const item: SearchItem = {
      Title: "The Matrix",
      Year: "1999",
      imdbID: "tt0133093",
      Type: "movie",
      Poster: "N/A",
    };
    expect(toMovieSummary(item)).toEqual({
      id: "tt0133093",
      title: "The Matrix",
      year: "1999",
      type: "movie",
      poster: null,
    });
  });
});

describe("toSearchPage", () => {
  it("computes pagination and hasMore (capped at 100 results)", () => {
    const page = toSearchPage([], 250, 1);
    expect(page.totalPages).toBe(10);
    expect(page.hasMore).toBe(true);
  });

  it("marks the last page without further results", () => {
    const page = toSearchPage([], 25, 3);
    expect(page.totalPages).toBe(3);
    expect(page.hasMore).toBe(false);
  });
});
