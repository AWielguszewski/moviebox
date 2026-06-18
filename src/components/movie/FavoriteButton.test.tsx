import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useFavoritesStore } from "@/features/favorites/store";
import type { MovieSummary } from "@/lib/omdb/types";

import { FavoriteButton } from "./FavoriteButton";

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

describe("FavoriteButton", () => {
  it("toggles favorite state and updates the store", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton movie={movie} />);

    const addButton = screen.getByRole("button", {
      name: /add to favorites/i,
    });
    expect(addButton).toHaveAttribute("aria-pressed", "false");

    await user.click(addButton);

    expect(useFavoritesStore.getState().items).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /remove from favorites/i }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
