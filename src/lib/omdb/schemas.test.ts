import { describe, expect, it } from "vitest";

import {
  detailResponseSchema,
  searchResponseSchema,
} from "./schemas";

describe("searchResponseSchema", () => {
  it("parses a successful search response", () => {
    const parsed = searchResponseSchema.parse({
      Response: "True",
      totalResults: "2",
      Search: [
        { Title: "A", Year: "2001", imdbID: "tt1", Type: "movie", Poster: "x" },
      ],
    });
    expect(parsed.Response).toBe("True");
  });

  it("parses an error response", () => {
    const parsed = searchResponseSchema.parse({
      Response: "False",
      Error: "Movie not found!",
    });
    expect(parsed).toEqual({ Response: "False", Error: "Movie not found!" });
  });
});

describe("detailResponseSchema", () => {
  it("parses a detail response and keeps extra fields", () => {
    const parsed = detailResponseSchema.parse({
      Response: "True",
      Title: "The Matrix",
      Year: "1999",
      imdbID: "tt0133093",
      Type: "movie",
      totalSeasons: "1",
    });
    expect(parsed.Response).toBe("True");
  });

  it("rejects malformed payloads", () => {
    expect(detailResponseSchema.safeParse({ foo: "bar" }).success).toBe(false);
  });
});
