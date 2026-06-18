import { describe, expect, it } from "vitest";

import { mapOmdbError } from "./errors";

describe("mapOmdbError", () => {
  it("maps 'Movie not found!' to NOT_FOUND", () => {
    expect(mapOmdbError("Movie not found!").code).toBe("NOT_FOUND");
  });

  it("maps 'Too many results.' to TOO_MANY_RESULTS", () => {
    expect(mapOmdbError("Too many results.").code).toBe("TOO_MANY_RESULTS");
  });

  it("maps request limit message to RATE_LIMIT", () => {
    expect(mapOmdbError("Request limit reached!").code).toBe("RATE_LIMIT");
  });

  it("maps invalid api key message to INVALID_KEY", () => {
    expect(mapOmdbError("Invalid API key!").code).toBe("INVALID_KEY");
  });

  it("falls back to API_ERROR for unknown messages", () => {
    const result = mapOmdbError("Something odd");
    expect(result.code).toBe("API_ERROR");
    expect(result.message).toBe("Something odd");
  });
});
